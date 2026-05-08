// Fetch a ingredientes

export const buscarIngredientes = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/ingredients");
      return await res.json();
  }   catch (error) {
      console.error("Error trayendo ingredientes:", error);
      return [];
    }
};

// Fetch recetas

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

 export const publicarReceta = async (form) => {
  try {
    const res = await fetch("http://localhost:3000/api/recipes", {
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

  } catch (error) {
    console.error(error);

    if (error.errors || error.general) {
      throw error;
    }

    throw {
      general: "Error en el servidor"
    };
  }
};

// Fetch login

export const ingresarUsuario = async ({ form, onClose, onLogin }) => {
  try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Error al iniciar sesión");
        return;
      }

      const user = await res.json();

      onLogin(user);
      onClose();

    } catch (err) {
      console.error(err);
    }
  }

  // Fetch Registrar

 export const registrarUsuario = async (form) => {
  const res = await fetch("http://localhost:3000/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(form)
  });

  const data = await res.json();

  if (!res.ok) {
    throw data;
    alert("Error en la api");
  }

  return data;
};