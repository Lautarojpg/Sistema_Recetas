import express from "express";
import cors from "cors";
import fs from "fs";
import { validarDatosReceta, validarDatosRegistroUsuario } from "./helpers.js";


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

  const errors = ValirdarDatosReceta(r, ingredients);

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
    return res.status(401).json({ error: "Credencialesss incorrectas" });
  }
  console.log("SERVER - Usuario logueado:", user);
  res.json(user);
});


app.post("/api/register", (req, res) => {
try{
  const { nombre, apellido, email, password } = req.body;

  const errores = validarDatosRegistroUsuario({ nombre, apellido, email, password, users });

  if (Object.keys(errores).length > 0) {
    console.log(errores);
    return res.status(400).json({
      errors: errores
    });
  }

  users.push({ nombre, apellido, email, password });

  fs.writeFileSync("./users.json", JSON.stringify(users, null, 2));

  res.json({ message: "Usuario creado" });
  
}catch(error){
  console.log(error);
  res.status(500).json({
      error: error.message
    });
}
    
});


// Rutas relacionadas a ingredientes

app.get("/api/ingredients", (req, res) => {
  res.json(ingredients);
});

// Escuchar servidor puerto 3000

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});