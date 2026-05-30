import express from 'express';
import RecetaController from '../controllers/RecetaController.js';

const router = express.Router();
const controller = new RecetaController();

router.get('/recetas', controller.buscarTodos);
router.get('/recetas/destacadas', controller.buscarDestacadas);
router.get('/recetas/usuario/:id', controller.buscarPorUsuario);
router.post('/recipes', controller.crear);

export default router;
