-- =============================================
-- Prueba SQL 1: Creación de Receta Exitosa
-- =============================================
-- Objetivo: Verificar que el SP permite insertar datos correctos.
-- Resultado esperado: Se ejecuta sin errores (Command(s) completed successfully).

EXEC sp_crear_receta 
    @nombre = 'Pizza Margarita de Prueba',
    @descripcion = 'Receta de prueba unitaria directa en SQL',
    @porcion = 4,         -- Dato Válido
    @imagen = 'pizza.jpg',
    @tiempo = 30,         -- Dato Válido
    @dificultad = 'Media',
    @fecha = '2024-01-01',
    @id_coccion = 1,      -- Asumiendo que existe el id_coccion = 1
    @id_usuario = 1;      -- Asumiendo que existe el id_usuario = 1

PRINT 'Prueba 1 superada: La receta se insertó correctamente.';
