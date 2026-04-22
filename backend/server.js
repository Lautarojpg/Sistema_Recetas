import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());

const recetas = JSON.parse(
  fs.readFileSync("./recipes.json", "utf-8")
);

app.get("/api/recetas", (req, res) => {
  const query = req.query.q?.toLowerCase() || "";

  const resultados = recetas.filter((r) =>
    r.nombre_receta.toLowerCase().includes(query)
  );

  res.json(resultados);
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});