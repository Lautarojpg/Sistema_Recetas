import { describe, it, expect } from 'vitest';
import { validarCamposReceta } from './utils.js';

// 'describe' agrupa un conjunto de pruebas relacionadas. En este caso, todas las validaciones de Frontend.
describe('Funcionalidad: CREAR RECETA (Validaciones Frontend)', () => {
  
  // 'it' define una prueba específica (Unit Test). 
  // Esta prueba verifica qué pasa si el usuario envía el formulario vacío.
  it('Prueba 1: Debe rechazar un formulario vacío y marcar todos los campos obligatorios como error', () => {
    // 1. PREPARACIÓN (Arrange): Creamos un formulario con datos vacíos o iniciales
    const formVacio = {
      nombre_receta: "",
      descripcion: "",
      instrucciones: [],
      tiempo_total: "",
      porcion: "",
      dificultad: "Fácil",
      ingredientes: []
    };

    // 2. ACCIÓN (Act): Ejecutamos la función de validación que queremos probar
    const errores = validarCamposReceta(formVacio);

    // 3. VERIFICACIÓN (Assert): Comprobamos que la función haya detectado errores en todos estos campos
    expect(errores).toHaveProperty('nombre_receta');
    expect(errores).toHaveProperty('descripcion');
    expect(errores).toHaveProperty('instrucciones');
    expect(errores).toHaveProperty('tiempo_total');
    expect(errores).toHaveProperty('porcion');
    expect(errores).toHaveProperty('ingredientes');
  });

  it('Prueba 2: Debe aceptar un formulario correctamente llenado sin devolver ningún error', () => {
    // 1. PREPARACIÓN: Simulamos un usuario que llenó todos los datos perfectamente
    const formValido = {
      nombre_receta: "Milanesa Napolitana",
      descripcion: "Deliciosa milanesa de carne con salsa, jamón y queso gratinado al horno.",
      instrucciones: ["Preparar la carne", "Empanar y freir", "Poner salsa y queso", "Gratinar al horno"],
      tiempo_total: 45,
      porcion: 2,
      dificultad: "Media",
      ingredientes: [
        { nombre: "Carne", cantidad: 500, unidad: "g" },
        { nombre: "Queso", cantidad: 200, unidad: "g" }
      ]
    };

    // 2. ACCIÓN: Ejecutamos la validación
    const errores = validarCamposReceta(formValido);
    
    // 3. VERIFICACIÓN: Si no hay errores, el objeto 'errores' debe estar completamente vacío (longitud 0)
    expect(Object.keys(errores).length).toBe(0);
  });

  it('Prueba 3: Debe rechazar datos ilógicos como un tiempo de preparación o porción negativa', () => {
    // 1. PREPARACIÓN: Un formulario que está bien, pero tiene valores numéricos imposibles
    const formInvalido = {
      nombre_receta: "Receta Test",
      descripcion: "Esta descripcion es lo suficientemente larga para que pase la validacion.",
      instrucciones: ["Paso 1"],
      tiempo_total: -10, // Dato inválido intencional (tiempo negativo)
      porcion: 0,        // Dato inválido intencional (cero porciones)
      dificultad: "Fácil",
      ingredientes: [
        { nombre: "Pan", cantidad: 1, unidad: "unidad" }
      ]
    };

    // 2. ACCIÓN: Validamos
    const errores = validarCamposReceta(formInvalido);

    // 3. VERIFICACIÓN: Comprobamos que el sistema devuelva un mensaje de error que contenga la palabra "positivo"
    expect(errores.tiempo_total).toContain("positivo");
    expect(errores.porcion).toContain("positivo");
  });

});
