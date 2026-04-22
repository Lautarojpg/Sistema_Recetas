import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const recetas = JSON.parse(
  fs.readFileSync("./recipes.json", "utf-8")
);

// endpoint de búsqueda

app.get("/api/recetas", (req, res) => {
  const query = req.query.q?.toLowerCase() || "";

  const resultados = recetas.filter((r) =>
    r.nombre_receta.toLowerCase().includes(query)
  );

  res.json(resultados);
});

// leer usuarios
const users = JSON.parse(
  fs.readFileSync("./users.json", "utf-8")
);

// LOGIN
app.post("/api/login", express.json(), (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  res.json(user);
});

// REGISTER
app.post("/api/register", express.json(), (req, res) => {
  const newUser = req.body;

  users.push(newUser);

  fs.writeFileSync("./users.json", JSON.stringify(users, null, 2));

  res.json({ message: "Usuario creado" });
});

// endpoint para recetas de un usuario

app.get("/api/recetas/usuario/:id", (req, res) => {
  console.log("PARAM ID:", req.params.id);

  const userId = req.params.id;

  const userRecetas = recetas.filter(
    r => r.id_usuario === parseInt(userId)
  );

  console.log("RESULTADO:", userRecetas);

  res.json(userRecetas);
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
