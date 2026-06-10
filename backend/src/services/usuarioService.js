import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';
import UsuarioRepository from '../repositories/UsuarioRepository.js';
import { generarToken } from '../middlewares/authMiddleware.js';

class UsuarioService {
    constructor() {
        this.usuarioRepository = new UsuarioRepository();
    }

    async registrar({ nombre, apellido, email, password }) {
        // 1. Validar campos requeridos
        if (!nombre || !nombre.trim()) {
            throw new Error('Nombre obligatorio');
        }
        if (!apellido || !apellido.trim()) {
            throw new Error('Apellido obligatorio');
        }
        if (!email || !email.trim()) {
            throw new Error('Email obligatorio');
        }
        if (!password || !password.trim()) {
            throw new Error('Contraseña obligatoria');
        }

        // 2. Validar contraseñas comunes (regla de negocio heredada de helpers.js)
        const passwordsComunes = [
            "123456",
            "password",
            "12345678",
            "qwerty",
            "admin",
            "admin123"
        ];
        if (passwordsComunes.includes(password.toLowerCase())) {
            throw new Error('La contraseña es demasiado insegura');
        }

        // 3. Verificar si el email ya existe en la base de datos
        const usuarioExistente = await this.usuarioRepository.buscarPorEmail(email);
        if (usuarioExistente) {
            throw new Error('El email ya está registrado');
        }

        // 4. Encriptar contraseña
        const hash = await bcrypt.hash(password, 10);

        // 5. Crear el modelo de dominio
        const nuevoUsuario = new Usuario(
            null,
            nombre.trim(),
            apellido.trim(),
            email.trim().toLowerCase(),
            hash
        );

        // 6. Persistir en la base de datos
        await this.usuarioRepository.crear(nuevoUsuario);

        return {
            nombre: nuevoUsuario.nombre,
            apellido: nuevoUsuario.apellido,
            email: nuevoUsuario.email
        };
    }

    async login(email, password) {
        if (!email || !email.trim()) {
            throw new Error('Email obligatorio');
        }
        if (!password || !password.trim()) {
            throw new Error('Contraseña obligatoria');
        }

        // 1. Buscar usuario por email
        const usuario = await this.usuarioRepository.buscarPorEmail(email);
        if (!usuario) {
            throw new Error('Credenciales incorrectas');
        }

        // 2. Verificar contraseña
        const passwordCorrecta = await bcrypt.compare(password, usuario.contraseña);
        if (!passwordCorrecta) {
            throw new Error('Credenciales incorrectas');
        }

        // 3. Generar token y retornar datos del usuario autenticado (sin contraseña)
        const datosUsuario = {
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email
        };

        const token = generarToken(datosUsuario);

        return {
            ...datosUsuario,
            token
        };
    }
}

export default UsuarioService;