// Helper para obtener headers con token de autenticación
function obtenerCabecerasAutenticacion() {
  const session = localStorage.getItem("session");
  const headers = { "Content-Type": "application/json" };
  if (session) {
    try {
      const user = JSON.parse(session);
      if (user?.token) {
        headers["Authorization"] = `Bearer ${user.token}`;
      }
    } catch (e) {
      // Session inválida
    }
  }
  return headers;
}

// Fetch a ingredientes

export const buscarIngredientes = async () => {
    try {
      const res = await fetch("/api/ingredients");
      return await res.json();
  }   catch (error) {
      console.error("Error trayendo ingredientes:", error);
      return [];
    }
};

// Fetch recetas

export const buscarDestacadas = async () => {
    try {
      const res = await fetch("/api/recetas/destacadas");

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
    const response = await fetch(`/api/recetas?q=${encodeURIComponent(busqueda)}`);
    return await response.json();
  } catch (error) {
    console.error("Error al buscar recetas:", error);
    return [];
  }
};

export const buscarTodasRecetas = async () => {
  try {
    const response = await fetch("/api/recetas");
    return await response.json();
  } catch (error) {
    console.error("Error al buscar todas las recetas:", error);
    return [];
  }
};

export const buscarRecetasUsuario = async (user) => {
    try {
      const res = await fetch(`/api/recetas/usuario/${user.id_usuario}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error trayendo recetas del usuario:", error);
      return [];
    }
  };

 export const publicarReceta = async (form) => {
  try {
    let res = await fetch("/api/recetas", {
      method: "POST",
      headers: obtenerCabecerasAutenticacion(),
      body: JSON.stringify(form)
    });

    // Fallback: Si el servidor backend no se reinició correctamente y sigue usando la ruta vieja
    if (res.status === 404) {
      res = await fetch("/api/recipes", {
        method: "POST",
        headers: obtenerCabecerasAutenticacion(),
        body: JSON.stringify(form)
      });
    }

    const data = await res.json();

    if (!res.ok) {
      throw data;
    }

    return data;

  } catch (error) {
    console.error("Error en publicarReceta:", error);

    if (error.errors || error.general || error.error) {
      throw error;
    }

    throw {
      general: error.message || "Error en el servidor"
    };
  }
};

export const calcularNutricion = async (ingredientes) => {
  try {
    const res = await fetch("/api/recetas/calcular-nutricion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredientes })
    });
    
    if (!res.ok) {
      throw new Error("Error al calcular nutrición en el servidor");
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error en calcularNutricion:", error);
    throw error;
  }
};

// Fetch login

export const ingresarUsuario = async (form) => {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(form)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Error al iniciar sesión");
  }

  return data;
};

  // Fetch Registrar

 export const registrarUsuario = async (form) => {
  const res = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(form)
  });

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
};

export const crearIngrediente = async (ingrediente) => {
  try {
    const res = await fetch("/api/ingredients", {
      method: "POST",
      headers: obtenerCabecerasAutenticacion(),
      body: JSON.stringify(ingrediente)
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  } catch (error) {
    console.error("Error al crear ingrediente:", error);
    throw error;
  }
};