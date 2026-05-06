import { useState, useEffect } from "react";

export function usarSesion() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("session"));
    if (session) setUser(session);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("session", JSON.stringify(user));
    } else {
      localStorage.removeItem("session");
    }
  }, [user]);

  return { user, setUser };
}