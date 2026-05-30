import sql from 'mssql';
import { getConnection } from '../database/connection.js';
import Usuario from '../models/Usuario.js';

class UsuarioRepository {
    async crear(usuario) {
        const connection = await getConnection();
        await connection.request()
            .input('nombre', sql.VarChar, usuario.nombre)
            .input('apellido', sql.VarChar, usuario.apellido)
            .input('email', sql.VarChar, usuario.email)
            .input('contraseña', sql.VarChar, usuario.contraseña)
            .execute('sp_crear_usuario');
    }

    async buscarPorEmail(email) {
        const connection = await getConnection();
        const result = await connection.request()
            .input('email', sql.VarChar, email)
            .execute('sp_buscar_usuario_email');

        if (result.recordset.length === 0) {
            return null;
        }

        const row = result.recordset[0];
        return new Usuario(
            row.id_usuario,
            row.nombre,
            row.apellido,
            row.email,
            row.contraseña
        );
    }

    async getUsuario(id) {
        const connection = await getConnection();
        const result = await connection.request()
            .input('id_usuario', sql.Int, id)
            .execute('sp_get_usuario');

        if (result.recordset.length === 0) {
            return null;
        }

        const row = result.recordset[0];
        return new Usuario(
            row.id_usuario,
            row.nombre,
            row.apellido,
            row.email,
            null // No devolvemos contraseña para obtener detalles
        );
    }
}

export default UsuarioRepository;