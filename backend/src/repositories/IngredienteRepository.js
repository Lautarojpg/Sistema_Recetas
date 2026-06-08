import sql from 'mssql';
import { getConnection } from '../database/connection.js';
import Ingrediente from '../models/Ingrediente.js';

class IngredienteRepository {
    async buscarTodos() {
        const connection = await getConnection();
        const result = await connection.request()
            .query('SELECT * FROM INGREDIENTE');
        
        return result.recordset.map(row => new Ingrediente(
            row.id_ingrediente,
            row.nombre,
            Number(row.calorias_por100g),
            Number(row.proteinas_por100),
            Number(row.carbs_por100),
            Number(row.grasas_por100g),
            row.icono,
            row.id_coccion
        ));
    }

    async buscarPorNombre(nombre) {
        const connection = await getConnection();
        const result = await connection.request()
            .input('nombre', sql.VarChar, nombre)
            .query('SELECT * FROM INGREDIENTE WHERE nombre = @nombre');
        
        if (result.recordset.length === 0) {
            return null;
        }

        const row = result.recordset[0];
        return new Ingrediente(
            row.id_ingrediente,
            row.nombre,
            Number(row.calorias_por100g),
            Number(row.proteinas_por100),
            Number(row.carbs_por100),
            Number(row.grasas_por100g),
            row.icono,
            row.id_coccion
        );
    }

    async crear(ingrediente) {
        const connection = await getConnection();
        await connection.request()
            .input('nombre', sql.VarChar, ingrediente.nombre)
            .input('calorias', sql.Decimal(10, 2), ingrediente.calorias_por100g)
            .input('proteinas', sql.Decimal(10, 2), ingrediente.proteinas_por100)
            .input('carbs', sql.Decimal(10, 2), ingrediente.carbs_por100)
            .input('grasas', sql.Decimal(10, 2), ingrediente.grasas_por100g)
            .input('icono', sql.VarChar, ingrediente.icono)
            .execute('sp_crear_ingrediente');
    }
}

export default IngredienteRepository;
