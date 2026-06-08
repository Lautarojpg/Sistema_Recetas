import express from 'express';
import IngredienteController from '../controllers/IngredienteController.js';

const router = express.Router();
const controller = new IngredienteController();

router.get('/ingredients', controller.buscarTodos);
router.post('/ingredients', controller.crear);

export default router;
