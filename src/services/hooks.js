import { useEffect, useState } from "react";
import { buscarIngredientes } from "./api.js"

// Hook de sesion

export function useSesion() {
  const [user, setUser] = useState(() => {
    const session = localStorage.getItem("session");
    return session ? JSON.parse(session) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("session", JSON.stringify(user));
    } else {
      localStorage.removeItem("session");
    }
  }, [user]);

  return { user, setUser };
}

// Hook de ingredientes

export function useIngredientes() {
  const [ingredientes, setIngredientes] = useState([]);
  useEffect(() => {
    const cargarIngredientes = async () => {
      const data = await buscarIngredientes();
      setIngredientes(data)
    };
    cargarIngredientes();
  }, []);

  return ingredientes;
}

