export const validarCamposReceta = (form) => {
  const errores = {};

  if (!form.nombre_receta || !form.nombre_receta.trim()) errores.nombre_receta = "Nombre requerido";
  else if(form.nombre_receta.trim().length < 6) errores.nombre_receta = "Nombre debe tener al menos 6 caracteres";
  
  if (!form.descripcion || !form.descripcion.trim()) errores.descripcion = "Descripción requerida";
  else if(form.descripcion.trim().length < 25) errores.descripcion = "Descripción debe tener al menos 25 caracteres";
  
  if (form.imagen) {
    const isUrl = /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(form.imagen);
    const isBase64 = form.imagen.startsWith('data:image/');
    if (!isUrl && !isBase64) {
      errores.imagen = "Imagen inválida";
    }
  }
  
  if (Array.isArray(form.instrucciones)) {
    if (form.instrucciones.length === 0 || form.instrucciones.every(s => !s || !s.trim())) {
      errores.instrucciones = "Instrucciones requeridas";
    }
  } else {
    if (!form.instrucciones || !form.instrucciones.trim()) {
      errores.instrucciones = "Instrucciones requeridas";
    }
  }

  if (isNaN(form.tiempo_total) || form.tiempo_total <= 0 || form.tiempo_total === "") errores.tiempo_total = "Tiempo total debe ser un número positivo";
  if (isNaN(form.porcion) || form.porcion <= 0 || form.porcion === "") errores.porcion = "Porción debe ser un número positivo";

  const dificultades = ["Fácil", "Media", "Difícil"];
  if (!dificultades.includes(form.dificultad)) {
    errores.dificultad = "Dificultad inválida";
  }

  if (!Array.isArray(form.ingredientes) || form.ingredientes.length === 0) {
    errores.ingredientes = "Debe haber al menos un ingrediente";
  } else {
    form.ingredientes.forEach((ing, i) => {
      if (!ing.nombre || !ing.nombre.trim()) errores.ingredientes = `Ingrediente ${i+1} sin nombre`;
      if (isNaN(ing.cantidad) || ing.cantidad <= 0 || ing.cantidad === "") errores.ingredientes = `Ingrediente ${i+1} cantidad inválida`;
      if (!ing.unidad || !ing.unidad.trim()) errores.ingredientes = `Seleccionar unidad para ingrediente ${i+1}`;
    });
  }
  return errores;
};

export const validarRegistrarUsuario = (form) => {
    const errores = {};

    if (!form.nombre.trim()) {
      errores.nombre = "El nombre es obligatorio";
    }

    if (!form.apellido.trim()) {
      errores.apellido = "El apellido es obligatorio";
    }

    if (!form.email.trim()) {
      errores.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errores.email = "Email inválido";
    }

    if (!form.password) {
      errores.password = "La contraseña es obligatoria";
    } else if (form.password.length < 6) {
      errores.password = "Mínimo 6 caracteres";
    }
    
    if(Object.keys(errores).length > 0) {
      return errores;
    }
    return {};

  };