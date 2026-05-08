export const validarDatosReceta = (r, ingredientesDB) => {
  const errors = {};

// Tipos
if (typeof r.tiempo_total !== "number" || r.tiempo_total <= 0) {
  errors.tiempo_total = "Tiempo inválido";
}

r.ingredientes.forEach((ing, i) => {
  const existe = ingredientesDB.find(iDB => iDB.nombre === ing.nombre);

  if (!existe) {
    errors.ingredientes = `Ingrediente inválido: ${ing.nombre}`;
  }

  if (typeof ing.cantidad !== "number" || ing.cantidad <= 0) {
    errors.ingredientes = `Cantidad inválida en ingrediente ${i}`;
  }
});

  const nombres = r.ingredientes.map(i => i.nombre);
  const duplicados = nombres.filter((n, i) => nombres.indexOf(n) !== i);

  if (duplicados.length > 0) {
    errors.ingredientes = "Hay ingredientes duplicados";
  }

  if (!r.id_usuario) {
    errors.usuario = "Usuario inválido";
  }
}

export const validarDatosRegistroUsuario = ({
  nombre,
  apellido,
  email,
  password,
  users
}) => {
  const errors = {};

  // Email ya registrado

  const emailExistente = users.some(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (emailExistente) {
    errors.email = "El email ya está registrado";
  }

  // Usuario duplicado (mismo nombre y apellido)

  const usuarioExistente = users.some(
    (user) =>
      user.nombre.trim().toLowerCase() === nombre.trim().toLowerCase() &&
      user.apellido.trim().toLowerCase() === apellido.trim().toLowerCase()
  );

  if (usuarioExistente) {
    errors.apellido = "Ya existe un usuario con ese nombre y apellido";
  }

  // Contraseña demasiado común

  const passwordsComunes = [
    "123456",
    "password",
    "12345678",
    "qwerty",
    "admin",
    "admin123"
  ];

  if (passwordsComunes.includes(password.toLowerCase())) {
    errors.password = "La contraseña es demasiado insegura";
  }

  return errors;
};