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


describe('Funcionalidad 3: FILTRAR RECETAS (Búsqueda Inversa)', () => {
        
        it('Prueba 1: Debe calcular correctamente la coincidencia matemática según los ingredientes del usuario', async () => {
            // 1. PREPARACIÓN: Tenemos 2 recetas. 
            // La receta 1 ("Pancho") requiere los ingredientes ID 1 y 2
            // La receta 2 ("Ensalada") requiere el ingrediente ID 3
            const mockRecetas = [
                { id_receta: 1, nombre_receta: "Pancho", ingredientes: [{ id_ingrediente: 1 }, { id_ingrediente: 2 }] },
                { id_receta: 2, nombre_receta: "Ensalada", ingredientes: [{ id_ingrediente: 3 }] }
            ];
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
            });

