-- =============================================
-- Prueba SQL 3: Rechazo por Tiempo Inválido
-- =============================================
-- Objetivo: Verificar que el SP detiene la transacción (THROW 50022) 
-- si se envía un tiempo negativo o cero.
-- Resultado esperado: Mensaje de Error en rojo que diga "Tiempo inválido".

EXEC sp_crear_receta 
    @nombre = 'Receta Fallida 2',
    @descripcion = 'Esta receta no debería guardarse',
    @porcion = 4,
    @imagen = 'test.jpg',
    @tiempo = 0,          -- DATO INVÁLIDO INTENCIONAL
    @dificultad = 'Fácil',
    @fecha = '2024-01-01',
    @id_coccion = 1,
    @id_usuario = 1;
