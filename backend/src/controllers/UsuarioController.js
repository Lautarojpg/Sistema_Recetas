import UsuarioService from '../services/UsuarioService.js';

class UsuarioController {
    constructor() {
        this.usuarioService = new UsuarioService();
    }

    registrar = async (req, res) => {
        try {
            const { nombre, apellido, email, password } = req.body;
            const result = await this.usuarioService.registrar({ nombre, apellido, email, password });
            return res.status(200).json({ message: "Usuario creado", ...result });
        } catch (error) {
            console.error("Error en registro:", error);
            
            // Si el error tiene mensaje conocido, enviarlo en formato esperado por el frontend
            const errors = {};
            if (error.message.includes('Nombre obligatorio')) errors.nombre = error.message;
            else if (error.message.includes('Apellido obligatorio')) errors.apellido = error.message;
            else if (error.message.includes('Email')) errors.email = error.message;
            else if (error.message.includes('Contraseña') || error.message.includes('insegura')) errors.password = error.message;
            else errors.general = error.message;

            if (Object.keys(errors).length > 0) {
                return res.status(400).json({ errors });
            }

            return res.status(500).json({ error: error.message });
        }
    }

    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await this.usuarioService.login(email, password);
            console.log("Usuario logueado correctamente:", user);
            return res.status(200).json(user);
        } catch (error) {
            console.error("Error en login:", error);
            
            if (error.message.includes('Credenciales') || error.message.includes('incorrectas') || error.message.includes('no encontrado')) {
                return res.status(401).json({ error: "Credencialesss incorrectas" }); // Con las 3 's' que tenía la respuesta original para mantener compatibilidad
            }
            
            return res.status(400).json({ error: error.message });
        }
    }
}

export default UsuarioController;
