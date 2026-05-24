import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';
import UsuarioRepository from '../repositories/UsuarioRepository.js';

class UsuarioService {

    constructor() {
        this.usuarioRepository = new UsuarioRepository();
    }

    async registrar(nombre, apellido, email, contraseña) {

        const usuarioExistente =
            await this.usuarioRepository.buscarPorEmail(email);

        if (usuarioExistente)
            throw new Error('El email ya existe');

        const hash = await bcrypt.hash(contraseña, 10);

        const usuario = new Usuario(
            null,
            nombre,
            apellido,
            email,
            hash
        );

        await this.usuarioRepository.crear(usuario);

        return usuario;
    }

    async login(email, pass) {

        const usuario =
            await this.usuarioRepository.buscarPorEmail(email);

        if (!usuario)
            throw new Error('Usuario no encontrado');

        const passwordCorrecta =
            await bcrypt.compare(pass, usuario.contraseña);

        if (!passwordCorrecta)
            throw new Error('Contraseña incorrecta');

        return {
            id: usuario.id_usuario,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email
        };
    }

    async registrarUsuario({
        nombre,
        apellido,
        email,
        password
    }) {

        validarDatosRegistroUsuario({
            nombre,
            apellido,
            email,
            password
        });

        const usuarioExistente =
            await this.usuarioRepository.buscarPorEmail(email);

        if (usuarioExistente)
            throw new Error('El email ya existe');

        const hash =
            await bcrypt.hash(password, 10);

        const usuario = new Usuario(
            null,
            nombre,
            apellido,
            email,
            hash
        );

        await this.usuarioRepository.crear(usuario);

        return {
            nombre,
            apellido,
            email
        };
    }
}

export default UsuarioService;