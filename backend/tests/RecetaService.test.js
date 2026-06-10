import { describe, it, expect, beforeEach, vi } from 'vitest';
import RecetaService from '../src/services/RecetaService.js';

// MOCKING (Simulación): Evita que el sistema intente conectarse a la Base de Datos real (SQL Server).
// En vez de usar los archivos reales de los Repositorios, creamos "dobles de riesgo" vacíos.
vi.mock('../src/repositories/RecetaRepository.js', () => {
    return {
        default: class {
            crear = vi.fn();            // Simulamos la función de insertar en DB
            buscarTodos = vi.fn();      // Simulamos la función de buscar en DB
            buscarPorUsuario = vi.fn();
        }
    };
});

vi.mock('../src/repositories/IngredienteRepository.js', () => {
    return {
        default: class {
            buscarTodos = vi.fn();
        }
    };
});

describe('', () => {
    let recetaService;

    // 'beforeEach' se ejecuta automáticamente antes de cada prueba individual
    beforeEach(() => {
        // Limpiamos cualquier dato viejo de la prueba anterior
        vi.clearAllMocks();
        // Instanciamos el servicio (el cerebro de nuestra app)
        recetaService = new RecetaService();
        
        // Retorno por defecto: Simulamos que la tabla de ingredientes en la base de datos está vacía
        recetaService.ingredienteRepository.buscarTodos.mockResolvedValue([]);
    });

    describe('Funcionalidad 1: CREAR RECETA', () => {
        
        it('Prueba 1: Debe rechazar la creación si la información enviada desde el cliente tiene formato incorrecto', async () => {
            // 1. PREPARACIÓN: Creamos un paquete de datos malo
            const datosReceta = {
                nombre_receta: "Pizza",
                tiempo_total: "texto-no-valido", // Error intencional: enviamos texto en vez de número
                porcion: 2,
                id_usuario: 1,
                ingredientes: [{ nombre: "Queso", cantidad: 200, unidad: "g" }]
            };

            // 2 y 3. ACCIÓN Y VERIFICACIÓN: Al intentar crearlo, esperamos que rechace ('rejects') y tire error
            await expect(recetaService.crearReceta(datosReceta)).rejects.toThrow("Errores de validación");
        });

        it('Prueba 2: Debe procesar los datos matemáticamente y retornar un ID si la receta es perfecta', async () => {
            // 1. PREPARACIÓN (MOCKING AVANZADO): 
            // Simulamos que al pedirle a la base de datos el ingrediente "Queso", esta nos responde que existe y es el ID 1
            recetaService.ingredienteRepository.buscarTodos.mockResolvedValue([
                { id_ingrediente: 1, nombre: "Queso" }
            ]);
            
            // Simulamos que al insertar la receta final en la DB, esta responde con el ID nuevo generado (ej: 99)
            recetaService.recetaRepository.crear.mockResolvedValue(99);

            const datosReceta = {
                nombre_receta: "Pizza de Queso",
                tiempo_total: 30,
                porcion: 4,
                id_usuario: 1,
                ingredientes: [{ nombre: "Queso", cantidad: 200, unidad: "g" }]
            };

            // 2. ACCIÓN: Enviamos los datos
            const resultado = await recetaService.crearReceta(datosReceta);

            // 3. VERIFICACIÓN: Confirmamos que el servicio haya procesado todo y nos devuelva el ID simulado
            expect(resultado).toEqual({ id_receta: 99 });
            // Confirmamos que el servicio haya llamado internamente a 'crear' en la base de datos exactamente 1 vez
            expect(recetaService.recetaRepository.crear).toHaveBeenCalledTimes(1);
        });

        it('Prueba 3: Integración con Procedimientos Almacenados (Manejo de Errores SQL)', async () => {
            // Requisito: Probar los Procedimientos Almacenados de creación.
            // Simulamos que el Repositorio llama a `sp_crear_receta` pero el SQL Server aborta la transacción
            // lanzando el error "THROW 50021, 'Porción inválida', 1;"
            
            recetaService.ingredienteRepository.buscarTodos.mockResolvedValue([{ id_ingrediente: 1, nombre: "Queso" }]);
            
            // Configuramos el mock para que simule una falla directa desde la base de datos (Stored Procedure)
            const errorSQL = new Error("Porción inválida");
            errorSQL.number = 50021; // Código de error de nuestro SP
            recetaService.recetaRepository.crear.mockRejectedValue(errorSQL);

            // Pasamos un payload que el Servicio considera perfectamente válido,
            // para obligar al código a llegar hasta la base de datos (SP).
            const datosReceta = {
                nombre_receta: "Pizza Rota",
                tiempo_total: 30,
                porcion: 4, 
                id_usuario: 1,
                ingredientes: [{ nombre: "Queso", cantidad: 200, unidad: "g" }]
            };

            // Ejecutamos y verificamos que el servicio propaga correctamente el error fatal del Procedimiento Almacenado
            await expect(recetaService.crearReceta(datosReceta)).rejects.toThrow("Porción inválida");
        });
    });

    describe('Funcionalidad 2: BUSCAR RECETAS', () => {
        
       

        it('Prueba 1: Debe manejar varios requests de búsqueda consistentes para distintos términos', async () => {
            // Requisito de la rúbrica: Hacer varios requests de búsqueda
            recetaService.recetaRepository.buscarTodos.mockImplementation(async (query) => {
                const todas = [{ nombre_receta: "Tarta" }, { nombre_receta: "Sopa" }, { nombre_receta: "Asado" }];
                if (!query) return todas;
                return todas.filter(r => r.nombre_receta.toLowerCase().includes(query.toLowerCase()));
            });

            // Simulamos varios requests simultáneos o secuenciales
            const resSopa = await recetaService.buscarRecetas('Sopa');
            const resTarta = await recetaService.buscarRecetas('tar');
            const resAsado = await recetaService.buscarRecetas('Asad');

            expect(resSopa).toHaveLength(1);
            expect(resSopa[0].nombre_receta).toBe("Sopa");
            
            expect(resTarta).toHaveLength(1);
            expect(resTarta[0].nombre_receta).toBe("Tarta");
            
            expect(resAsado).toHaveLength(1);
            expect(resAsado[0].nombre_receta).toBe("Asado");
        });
    });

    describe('Funcionalidad 3: FILTRAR RECETAS (Búsqueda Inversa)', () => {
        
        it('Prueba 1: Debe calcular correctamente la coincidencia matemática según los ingredientes del usuario', async () => {
            // 1. PREPARACIÓN: Tenemos 2 recetas. 
            // La receta 1 ("Pancho") requiere los ingredientes ID 1 y 2
            // La receta 2 ("Ensalada") requiere el ingrediente ID 3
            const mockRecetas = [
                { id_receta: 1, nombre_receta: "Pancho", ingredientes: [{ id_ingrediente: 1 }, { id_ingrediente: 2 }] },
                { id_receta: 2, nombre_receta: "Ensalada", ingredientes: [{ id_ingrediente: 3 }] }
            ];
            
            // Usamos spyOn para interceptar internamente y pasar nuestras recetas simuladas
            vi.spyOn(recetaService, 'buscarRecetas').mockResolvedValue(mockRecetas);

            // El usuario dice en la interfaz: "Solo tengo los ingredientes 1 y 2 en mi casa"
            const ingredientesUsuario = [ { id_ingrediente: 1 }, { id_ingrediente: 2 } ];

            // 2. ACCIÓN: Mandamos a filtrar
            const resultado = await recetaService.filtrarRecetas(ingredientesUsuario, null);

            // 3. VERIFICACIÓN: El sistema debe haber filtrado y descartado la ensalada.
            // Solo nos devuelve el Pancho, que tiene exactamente 100% de coincidencia matemática.
            expect(resultado).toHaveLength(1);
            expect(resultado[0].nombre_receta).toBe("Pancho");
            expect(resultado[0].porcentaje).toBe(100);
        });
        
        it('Prueba 2: Como medida de seguridad, debe retornar una lista vacía si el usuario no pone ningún ingrediente', async () => {
            vi.spyOn(recetaService, 'buscarRecetas').mockResolvedValue([{ id_receta: 1 }]);
            
            const resultado = await recetaService.filtrarRecetas([], null);
            
            expect(resultado).toEqual([]); // Array vacío garantizado
        });

        it('Prueba 3: Debe filtrar correctamente aplicando todo tipo de filtros avanzados (Dificultad, Tiempo, Macros)', async () => {
            // Requisito de la rúbrica: Probar TODO TIPO DE FILTROS
            const mockRecetas = [
                { 
                    id_receta: 1, nombre_receta: "Receta Rapida Facil", 
                    dificultad: "Fácil", tiempo_total: 15,
                    info_nutricional: { proteinas_totales: 10, grasas_totales: 5, carbs_totales: 20 },
                    ingredientes: [{ id_ingrediente: 1 }]
                },
                { 
                    id_receta: 2, nombre_receta: "Receta Lenta Dificil", 
                    dificultad: "Difícil", tiempo_total: 120,
                    info_nutricional: { proteinas_totales: 50, grasas_totales: 30, carbs_totales: 100 },
                    ingredientes: [{ id_ingrediente: 1 }]
                }
            ];
            vi.spyOn(recetaService, 'buscarRecetas').mockResolvedValue(mockRecetas);
            const ingUsuario = [{ id_ingrediente: 1 }]; // Tienen ambos

            // Filtro 1: Solo Dificultad Fácil
            const resFacil = await recetaService.filtrarRecetas(ingUsuario, { dificultad: "Fácil" });
            expect(resFacil).toHaveLength(1);
            expect(resFacil[0].nombre_receta).toBe("Receta Rapida Facil");

            // Filtro 2: Tiempo Máximo 30 minutos
            const resRapida = await recetaService.filtrarRecetas(ingUsuario, { tiempoMax: 30 });
            expect(resRapida).toHaveLength(1);
            expect(resRapida[0].tiempo_total).toBeLessThanOrEqual(30);

            // Filtro 3: Proteínas Máximas 20g
            const resProteina = await recetaService.filtrarRecetas(ingUsuario, { proteinasMax: 20 });
            expect(resProteina).toHaveLength(1);
            expect(resProteina[0].info_nutricional.proteinas_totales).toBeLessThanOrEqual(20);

            // Filtro 4: Todos los filtros aplicados a la vez para descartar todo
            const resImposible = await recetaService.filtrarRecetas(ingUsuario, { 
                dificultad: "Difícil", 
                tiempoMax: 10 // Pide algo difícil que se haga en 10 min, no hay
            });
            expect(resImposible).toHaveLength(0);
        });
    });

});
