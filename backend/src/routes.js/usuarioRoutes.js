import express from 'express';
import UsuarioController from '../controllers/UsuarioController.js';

const router = express.Router();
const controller = new UsuarioController();

router.post('/register', controller.registrarUsuario);
router.post('/login', controller.loginUsuario);

export default router;