import express from "express";
import cors from "cors";
import usuarioRoutes from "./src/routes.js/usuarioRoutes.js";
import recetaRoutes from "./src/routes.js/recetaRoutes.js";
import ingredienteRoutes from "./src/routes.js/ingredienteRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Montar las rutas en /api
app.use("/api", usuarioRoutes);
app.use("/api", recetaRoutes);
app.use("/api", ingredienteRoutes);

// Servir archivos estáticos (opcional, para las imágenes del frontend si estuvieran en backend)
app.use("/public", express.static("public"));

// Manejo global de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejo global de errores del servidor
app.use((err, req, res, next) => {
  console.error("Error global en el servidor:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});