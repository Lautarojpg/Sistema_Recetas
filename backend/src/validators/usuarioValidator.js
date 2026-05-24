export async function validarRegistroUsuario(
    nombre,
    apellido,
    email,
    password,
    usuarioRepository
) {

    validarDatosRegistroUsuario({
        nombre,
        apellido,
        email,
        password
    });

    const usuarioExistente =
        await usuarioRepository.buscarPorEmail(email);

    if (usuarioExistente)
        throw new Error('El email ya está registrado');

}