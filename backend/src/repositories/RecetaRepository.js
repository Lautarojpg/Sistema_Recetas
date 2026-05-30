import sql from 'mssql';
import { getConnection } from '../database/connection.js';
import Receta from '../models/Receta.js';

class RecetaRepository {
    async crear(receta) {
        const connection = await getConnection();
        
        // 1. Crear la receta usando sp_crear_receta
        await connection.request()
            .input('nombre', sql.VarChar, receta.nombre_receta)
            .input('descripcion', sql.VarChar, receta.descripcion)
            .input('porcion', sql.Int, receta.porcion)
            .input('imagen', sql.VarChar, receta.imagen)
            .input('tiempo', sql.Int, receta.tiempo_total)
            .input('dificultad', sql.VarChar, receta.dificultad)
            .input('fecha', sql.Date, receta.fecha_creacion || new Date())
            .input('id_coccion', sql.Int, receta.id_coccion || 1)
            .input('id_usuario', sql.Int, receta.id_usuario)
            .execute('sp_crear_receta');

        // 2. Obtener el ID asignado
        const resultId = await connection.request()
            .input('id_usuario', sql.Int, receta.id_usuario)
            .query('SELECT TOP 1 id_receta FROM RECETA WHERE id_usuario = @id_usuario ORDER BY id_receta DESC');

        if (resultId.recordset.length === 0) {
            throw new Error('No se pudo recuperar el ID de la receta creada');
        }
        const id_receta = resultId.recordset[0].id_receta;

        // 3. Agregar instrucciones (si se proveen) usando sp_agregar_instruccion
        if (receta.instrucciones) {
            await connection.request()
                .input('id_receta', sql.Int, id_receta)
                .input('num_paso', sql.Int, 1)
                .input('texto', sql.VarChar, receta.instrucciones)
                .input('imagen', sql.VarChar, null)
                .execute('sp_agregar_instruccion');
        }

        // 4. Agregar ingredientes usando sp_agregar_ingrediente_a_receta
        if (Array.isArray(receta.ingredientes)) {
            for (let i = 0; i < receta.ingredientes.length; i++) {
                const ing = receta.ingredientes[i];
                await connection.request()
                    .input('id_receta', sql.Int, id_receta)
                    .input('id_ingrediente', sql.Int, ing.id_ingrediente)
                    .input('cantidad', sql.Decimal(10, 2), ing.cantidad)
                    .input('unidad', sql.VarChar, ing.unidad)
                    .input('orden', sql.Int, i + 1)
                    .execute('sp_agregar_ingrediente_a_receta');
            }
        }

        // 5. Actualizar la información nutricional en la tabla RECETA
        // ya que sp_crear_receta por defecto inicializa en 0
        await connection.request()
            .input('id_receta', sql.Int, id_receta)
            .input('proteinas', sql.Decimal(10, 2), receta.proteinas_totales || 0)
            .input('grasas', sql.Decimal(10, 2), receta.grasas_totales || 0)
            .input('carbs', sql.Decimal(10, 2), receta.carbs_totales || 0)
            .input('calorias', sql.Decimal(10, 2), receta.aporte_calorico_total || 0)
            .query(`
                UPDATE RECETA 
                SET proteinas_totales = @proteinas,
                    grasas_totales = @grasas,
                    carbs_totales = @carbs,
                    aporte_calorico_total = @calorias
                WHERE id_receta = @id_receta
            `);

        return id_receta;
    }

    async buscarTodos(queryBusqueda = '') {
        const connection = await getConnection();
        
        let queryStr = `
            SELECT r.*, c.nombre_tipo as nombre_coccion 
            FROM RECETA r
            LEFT JOIN COCCION c ON r.id_coccion = c.id_coccion
        `;
        
        const request = connection.request();
        
        if (queryBusqueda) {
            queryStr += ' WHERE r.nombre_receta LIKE @busqueda';
            request.input('busqueda', sql.VarChar, `%${queryBusqueda}%`);
        }

        const result = await request.query(queryStr);
        const recetas = [];

        for (const row of result.recordset) {
            const receta = await this._cargarDetallesReceta(row);
            recetas.push(receta);
        }

        return recetas;
    }

    async buscarPorUsuario(idUsuario) {
        const connection = await getConnection();
        const result = await connection.request()
            .input('id_usuario', sql.Int, idUsuario)
            .query('SELECT r.*, c.nombre_tipo as nombre_coccion FROM RECETA r LEFT JOIN COCCION c ON r.id_coccion = c.id_coccion WHERE r.id_usuario = @id_usuario');

        const recetas = [];
        for (const row of result.recordset) {
            const receta = await this._cargarDetallesReceta(row);
            recetas.push(receta);
        }
        return recetas;
    }

    async buscarDestacadas() {
        const connection = await getConnection();
        // Dado que la base de datos no tiene una columna 'destacada',
        // definimos que las recetas con IDs específicos 1, 2, 5, 8, 10
        // o las primeras 5 de la base de datos son destacadas.
        const result = await connection.request()
            .query(`
                SELECT r.*, c.nombre_tipo as nombre_coccion 
                FROM RECETA r 
                LEFT JOIN COCCION c ON r.id_coccion = c.id_coccion
                WHERE r.id_receta IN (1, 2, 5, 8, 10)
                   OR r.id_receta IN (SELECT TOP 5 id_receta FROM RECETA ORDER BY id_receta DESC)
            `);

        const recetas = [];
        for (const row of result.recordset) {
            const receta = await this._cargarDetallesReceta(row);
            // Aseguramos que la propiedad destacada sea true
            receta.destacada = true;
            recetas.push(receta);
        }
        return recetas;
    }

    async buscarPorId(idReceta) {
        const connection = await getConnection();
        const result = await connection.request()
            .input('id_receta', sql.Int, idReceta)
            .query('SELECT r.*, c.nombre_tipo as nombre_coccion FROM RECETA r LEFT JOIN COCCION c ON r.id_coccion = c.id_coccion WHERE r.id_receta = @id_receta');

        if (result.recordset.length === 0) {
            return null;
        }

        return await this._cargarDetallesReceta(result.recordset[0]);
    }

    // Método auxiliar privado para cargar ingredientes e instrucciones
    async _cargarDetallesReceta(row) {
        const connection = await getConnection();
        const id_receta = row.id_receta;

        // 1. Cargar ingredientes
        const ingResult = await connection.request()
            .input('id_receta', sql.Int, id_receta)
            .query(`
                SELECT ri.id_ingrediente, i.nombre, ri.cantidad, ri.unidad 
                FROM RECETA_INGREDIENTE ri
                JOIN INGREDIENTE i ON ri.id_ingrediente = i.id_ingrediente
                WHERE ri.id_receta = @id_receta
                ORDER BY ri.orden
            `);
        
        const ingredientes = ingResult.recordset.map(r => ({
            id_ingrediente: r.id_ingrediente,
            nombre: r.nombre,
            cantidad: Number(r.cantidad),
            unidad: r.unidad
        }));

        // 2. Cargar instrucciones
        const instResult = await connection.request()
            .input('id_receta', sql.Int, id_receta)
            .query('SELECT instruccion FROM INSTRUCCIONES WHERE id_receta = @id_receta ORDER BY num_paso');
        
        const instruccionesText = instResult.recordset.map(r => r.instruccion).join('\n');

        // Mapeo a formato esperado por el frontend
        return {
            id_receta: row.id_receta,
            nombre_receta: row.nombre_receta,
            descripcion: row.descripcion,
            porcion: row.porcion,
            imagen: row.imagen,
            tiempo_total: row.tiempo_total,
            dificultad: row.dificultad,
            fecha_creacion: row.fecha_creacion,
            id_coccion: row.id_coccion,
            id_usuario: row.id_usuario,
            destacada: [1, 2, 5, 8, 10].includes(row.id_receta),
            info_nutricional: {
                proteinas_totales: Number(row.proteinas_totales),
                grasas_totales: Number(row.grasas_totales),
                carbs_totales: Number(row.carbs_totales),
                aporte_calorico_total: Number(row.aporte_calorico_total)
            },
            ingredientes: ingredientes,
            instrucciones: instruccionesText
        };
    }
}

export default RecetaRepository;
