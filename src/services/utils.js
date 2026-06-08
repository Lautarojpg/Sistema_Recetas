export const validarCamposReceta = (form) => {
  const errores = {};

  if (!form.nombre_receta?.trim()) errors.nombre_receta = "Nombre requerido";
  if(form.nombre_receta.length < 6) errors.nombre_receta = "Nombre debe tener al menos 6 caracteres";
  if (!form.descripcion?.trim() || form.descripcion === "") errors.descripcion = "Descripción requerida";
  if(form.descripcion.length < 25) errors.descripcion = "Descripción debe tener al menos 25 caracteres";
  if (form.imagen && !/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(form.imagen)) errors.imagen = "URL de imagen inválida";
  if (Array.isArray(form.instrucciones)) {
    if (form.instrucciones.length === 0 || form.instrucciones.every(s => !s || !s.trim())) {
      errors.instrucciones = "Instrucciones requeridas";
    }
  } else {
    if (!form.instrucciones?.trim() || form.instrucciones === "") {
      errors.instrucciones = "Instrucciones requeridas";
    }
  }

  if (isNaN(form.tiempo_total) || form.tiempo_total <= 0 || form.tiempo_total === "") errors.tiempo_total = "Tiempo total debe ser un número positivo";
  if (isNaN(form.porcion) || form.porcion <= 0 || form.porcion === "") errors.porcion = "Porción debe ser un número positivo";

  const dificultades = ["Fácil", "Media", "Difícil"];
  if (!dificultades.includes(form.dificultad)) {
    errors.dificultad = "Dificultad inválida";
  }

  if (!Array.isArray(form.ingredientes) || form.ingredientes.length === 0) {
    errors.ingredientes = "Debe haber al menos un ingrediente";
  } else {
    form.ingredientes.forEach((ing, i) => {
      if (!ing.nombre?.trim() || ing.nombre === "") errors.ingredientes = `Ingrediente ${i+1} sin nombre`;
      if (isNaN(ing.cantidad) || ing.cantidad <= 0 || ing.cantidad === "") errors.ingredientes = `Ingrediente ${i+1} cantidad inválida`;
      if (!ing.unidad?.trim()) errors.ingredientes = `Seleccionar unidad para ingrediente ${i+1}`;
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