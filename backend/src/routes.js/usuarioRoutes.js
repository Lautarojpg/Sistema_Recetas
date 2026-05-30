import express from 'express';
import UsuarioController from '../controllers/UsuarioController.js';

const router = express.Router();
const controller = new UsuarioController();

router.post('/register', controller.registrar);
router.post('/login', controller.login);

export default router;