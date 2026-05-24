import sql from 'mssql';
import { getConnection } from '../database/connection.js';
import Usuario from '../models/Usuario.js';
import {validarDatosRegistroUsuario} from '../validators/UsuarioValidator.js';

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

        if (result.recordset.length === 0)
            return null;

        return result.recordset[0];
    }

    async getUsuario(id) {

        const connection = await getConnection();

        const result = await connection.request()
            .input('id_usuario', sql.Int, id)
            .execute('sp_get_usuario');

        return result.recordset[0];
    }
}

export default UsuarioRepository;