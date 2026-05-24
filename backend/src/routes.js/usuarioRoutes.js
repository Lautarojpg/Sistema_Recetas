import express from 'express';
import UsuarioController from '../controllers/UsuarioController.js';

const router = express.Router();

const controller = new UsuarioController();

router.post('/registro', controller.registrar);

export default router;