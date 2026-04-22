import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Cargar datos
const recetas = JSON.parse(
  fs.readFileSync("./recipes.json", "utf-8")
);

const users = JSON.parse(
  fs.readFileSync("./users.json", "utf-8")
);


app.get("/api/recetas", (req, res) => {
  const query = req.query.q?.toLowerCase() || "";

  const resultados = recetas.filter((r) =>
    r.nombre_receta.toLowerCase().includes(query)
  );

  res.json(resultados);
});

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


app.get("/api/recetas/usuario/:id", (req, res) => {
  const userId = parseInt(req.params.id);

  const userRecetas = recetas.filter(
    (r) => r.id_usuario === userId
  );

  res.json(userRecetas);
});


app.get("/api/recetas/destacadas", (req, res) => {
  const destacadas = recetas.filter((r) => r.destacada);
  res.json(destacadas);
});


app.post("/api/recipes", (req, res) => {
  const r = req.body;

  const errors = [];


  if (!r.nombre_receta?.trim()) errors.push("nombre_receta requerido");
  if (!r.descripcion?.trim()) errors.push("descripcion requerida");
  if (!r.instrucciones?.trim()) errors.push("instrucciones requeridas");


  if (isNaN(r.tiempo_total)) errors.push("tiempo_total debe ser número");
  if (isNaN(r.porcion)) errors.push("porcion debe ser número");


  const dificultades = ["Fácil", "Media", "Difícil"];
  if (!dificultades.includes(r.dificultad)) {
    errors.push("dificultad inválida");
  }

  if (!r.info_nutricional) {
    errors.push("info_nutricional requerida");
  } else {
    const n = r.info_nutricional;

    if (isNaN(n.proteinas_totales)) errors.push("proteinas inválidas");
    if (isNaN(n.grasas_totales)) errors.push("grasas inválidas");
    if (isNaN(n.carbs_totales)) errors.push("carbs inválidos");
    if (isNaN(n.aporte_calorico_total)) errors.push("calorías inválidas");
  }

  if (!Array.isArray(r.ingredientes) || r.ingredientes.length === 0) {
    errors.push("Debe haber al menos un ingrediente");
  } else {
    r.ingredientes.forEach((ing, i) => {
      if (!ing.nombre?.trim()) errors.push(`Ingrediente ${i} sin nombre`);
      if (isNaN(ing.cantidad)) errors.push(`Ingrediente ${i} cantidad inválida`);
      if (!ing.unidad?.trim()) errors.push(`Ingrediente ${i} sin unidad`);
    });
  }

  if (errors.length > 0) {
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
    message: "Receta creada",
    id_receta: nextId
  });
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});