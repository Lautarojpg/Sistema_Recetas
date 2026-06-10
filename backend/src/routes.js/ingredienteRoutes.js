import express from 'express';
import IngredienteController from '../controllers/IngredienteController.js';
import { verificarSesion } from '../middlewares/authMiddleware.js';

const router = express.Router();
const controller = new IngredienteController();

// Pública: cualquiera puede ver los ingredientes
router.get('/ingredients', controller.buscarTodosIngredientes);

// Protegida: solo usuarios autenticados pueden crear ingredientes
router.post('/ingredients', verificarSesion, controller.crearIngrediente);

export default router;
