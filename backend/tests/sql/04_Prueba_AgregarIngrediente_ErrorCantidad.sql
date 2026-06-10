-- =============================================
-- Prueba SQL 4: Rechazo al agregar Ingrediente Inválido
-- =============================================
-- Objetivo: Verificar que el SP de ingredientes protege contra
-- cantidades negativas (THROW 50030).
-- Resultado esperado: Mensaje de Error en rojo que diga "Cantidad inválida".

EXEC sp_agregar_ingrediente_a_receta
  @id_receta = 1,         -- Asumiendo receta válida
  @id_ingrediente = 1,    -- Asumiendo ingrediente válido
  @cantidad = -10.50,     -- CANTIDAD INVÁLIDA
  @unidad = 'g',
  @orden = 1;
