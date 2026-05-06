export const buscarIngredientes = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/ingredients");
      return await res.json();
  }   catch (error) {
      console.error("Error trayendo ingredientes:", error);
      return [];
    }
};

export const buscarDestacadas = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/recetas/destacadas");

      if (!res.ok) throw new Error("Error en API");

      const data = await res.json();
      return data;

    } catch (err) {
      console.error(err);
      return [];
    }
  };

export const buscarReceta = async (busqueda) => {
  try {
    const response = await fetch(`http://localhost:3000/api/recetas?q=${busqueda}`);
    return await response.json();
  } catch (error) {
    console.error("Error al buscar recetas:", error);
    return [];
  }
};

export const buscarRecetasUsuario = async (user) => {
    try {
      const res = await fetch(`http://localhost:3000/api/recetas/usuario/${user.id_usuario}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error trayendo recetas del usuario:", error);
      return [];
    }
  };

 export const publicarReceta = async (e, form) => {
      try {
      const res = await fetch("http://localhost:3000/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

    } catch (err) {
      console.error(err);
      return { general: "Error al enviar receta" };
    }
};