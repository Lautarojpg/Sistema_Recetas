import express from 'express';
import RecetaController from '../controllers/RecetaController.js';
import { verificarSesion } from '../middlewares/authMiddleware.js';

const router = express.Router();
const controller = new RecetaController();

// Públicas: lectura libre
router.get('/recetas', controller.buscarRecetas);
router.get('/recetas/destacadas', controller.buscarRecetasDestacadas);
router.get('/recetas/usuario/:id', controller.buscarRecetasPorUsuario);
router.post('/recetas/filtrar', controller.filtrarRecetas);
router.post('/recetas/calcular-nutricion', controller.calcularNutricion);

// Protegida: solo usuarios autenticados pueden crear recetas
router.post('/recetas', verificarSesion, controller.crearReceta);

export default router;
