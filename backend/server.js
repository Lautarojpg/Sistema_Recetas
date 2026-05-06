import express from "express";
import cors from "cors";
import fs from "fs";
import { validarDatosReceta } from "./helpers.js";


const app = express();
app.use(cors());
app.use(express.json());

// Cargar datos

const recetas = JSON.parse(
  fs.readFileSync("./recipes.json", "utf-8")
);

const users = JSON.parse(
  fs.readFileSync("./users.json", "utf-8")
);

const ingredients = JSON.parse(
  fs.readFileSync("./ingredients.json", "utf-8")
);


// Rutas relacionadas a las recetas

// Busqueda de recetas con query

app.get("/api/recetas", (req, res) => {
  const busqueda = req.query.q?.toLowerCase() || "";

  const resultados = recetas.filter((r) =>
    r.nombre_receta.toLowerCase().includes(busqueda)
  );

  res.json(resultados);
});

// Devuelve recetas de usuario especifico

app.get("/api/recetas/usuario/:id", (req, res) => {
  const userId = parseInt(req.params.id);

  const userRecetas = recetas.filter(
    (r) => r.id_usuario === userId
  );

  res.json(userRecetas);
});


// Devuelve recetas destacadas

app.get("/api/recetas/destacadas", (req, res) => {
  const destacadas = recetas.filter((r) => r.destacada);
  res.json(destacadas);
});


// Crear nueva receta

app.post("/api/recipes", (req, res) => {
  const r = req.body;

  const errors = validarDatosReceta(r, ingredients);

  if (Object.keys(errors).length > 0) {
    console.log("Errores al crear receta:", errors);
    return res.status(400).json({ errors });
  }

  const nextId =
    recetas.length > 0
      ? Math.max(...recetas.map((r) => r.id_receta)) + 1
      : 1;

  r.id_receta = nextId;

  recetas.push(r);

  fs.writeFileSync(
    "./recipes.json",
    JSON.stringify(recetas, null, 2)
  );

  res.json({
    message: "Receta enviada para revision",
    id_receta: nextId
  });
});


// Rutas relacionadas al manejo de usuario

// Login y registro

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  res.json(user);
});


app.post("/api/register", (req, res) => {
  const { nombre, apellido, email, password } = req.body;

  const errors = [];

  if (!nombre?.trim()) errors.push("nombre requerido");
  if (!apellido?.trim()) errors.push("apellido requerido");

  if (!email?.trim()) {
    errors.push("email requerido");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("email inválido");
  }

  if (!password || password.length < 6) {
    errors.push("password mínimo 6 caracteres");
  }

  const exists = users.find((u) => u.email === email);
  if (exists) {
    errors.push("email ya registrado");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  users.push({ nombre, apellido, email, password });

  fs.writeFileSync("./users.json", JSON.stringify(users, null, 2));

  res.json({ message: "Usuario creado" });
});


// Rutas relacionadas a ingredientes

app.get("/api/ingredients", (req, res) => {
  res.json(ingredients);
});

// Escuchar servidor puerto 3000

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});