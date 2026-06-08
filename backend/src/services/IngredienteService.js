import IngredienteRepository from '../repositories/IngredienteRepository.js';

class IngredienteService {
    constructor() {
        this.ingredienteRepository = new IngredienteRepository();
    }

    async obtenerTodos() {
        return await this.ingredienteRepository.buscarTodos();
    }

    async crearIngrediente(datosIngrediente) {
        if (!datosIngrediente.nombre || !datosIngrediente.nombre.trim()) {
            throw new Error("El nombre del ingrediente es obligatorio");
        }

        const calorias = Number(datosIngrediente.calorias_por100g);
        const proteinas = Number(datosIngrediente.proteinas_por100);
        const carbs = Number(datosIngrediente.carbs_por100);
        const grasas = Number(datosIngrediente.grasas_por100g);

        if (isNaN(calorias) || calorias < 0 ||
            isNaN(proteinas) || proteinas < 0 ||
            isNaN(carbs) || carbs < 0 ||
            isNaN(grasas) || grasas < 0) {
            throw new Error("Los valores nutricionales deben ser números positivos o cero");
        }

        const nuevoIngrediente = {
            nombre: datosIngrediente.nombre.trim(),
            calorias_por100g: calorias,
            proteinas_por100: proteinas,
            carbs_por100: carbs,
            grasas_por100g: grasas,
            icono: datosIngrediente.icono || '🍎',
            id_coccion: datosIngrediente.id_coccion || null
        };

        return await this.ingredienteRepository.crear(nuevoIngrediente);
    }
}

export default IngredienteService;
