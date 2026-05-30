import IngredienteRepository from '../repositories/IngredienteRepository.js';

class IngredienteService {
    constructor() {
        this.ingredienteRepository = new IngredienteRepository();
    }

    async obtenerTodos() {
        return await this.ingredienteRepository.buscarTodos();
    }
}

export default IngredienteService;
