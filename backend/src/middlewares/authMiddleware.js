import crypto from 'crypto';

const SECRET = process.env.JWT_SECRET || 'recetas_secret_key_2024';

// Genera un token firmado con HMAC-SHA256
export function generarToken(payload) {
    const datos = {
        ...payload,
        exp: Date.now() + (24 * 60 * 60 * 1000) // Expira en 24 horas
    };
    const datosBase64 = Buffer.from(JSON.stringify(datos)).toString('base64url');
    const firma = crypto.createHmac('sha256', SECRET).update(datosBase64).digest('base64url');
    return `${datosBase64}.${firma}`;
}

// Verifica y decodifica un token
export function verificarToken(token) {
    const [datosBase64, firma] = token.split('.');
    if (!datosBase64 || !firma) return null;

    const firmaEsperada = crypto.createHmac('sha256', SECRET).update(datosBase64).digest('base64url');
    if (firma !== firmaEsperada) return null;

    const datos = JSON.parse(Buffer.from(datosBase64, 'base64url').toString());
    if (datos.exp && datos.exp < Date.now()) return null;

    return datos;
}

// Middleware de autenticación para Express
export function verificarSesion(peticion, respuesta, siguiente) {
    const authHeader = peticion.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return respuesta.status(401).json({ error: 'No autorizado. Debe iniciar sesión.' });
    }

    const token = authHeader.split(' ')[1];
    const usuario = verificarToken(token);

    if (!usuario) {
        return respuesta.status(401).json({ error: 'Sesión inválida o expirada. Inicie sesión nuevamente.' });
    }

    peticion.usuario = usuario;
    siguiente();
}
