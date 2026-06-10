-- =============================================
-- Prueba SQL 2: Rechazo por Porción Inválida
-- =============================================
-- Objetivo: Verificar que el SP detiene la transacción (THROW 50021) 
-- si se envía una porción negativa o cero.
-- Resultado esperado: Mensaje de Error en rojo que diga "Porción inválida".

EXEC sp_crear_receta 
    @nombre = 'Receta Fallida',
    @descripcion = 'Esta receta no debería guardarse',
    @porcion = -2,        -- DATO INVÁLIDO INTENCIONAL
    @imagen = 'test.jpg',
    @tiempo = 45,
    @dificultad = 'Fácil',
    @fecha = '2024-01-01',
    @id_coccion = 1,
    @id_usuario = 1;
