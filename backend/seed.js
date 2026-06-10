import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import sql from 'mssql';
import { getConnection } from './src/database/connection.js';

async function seed() {
    let connection;
    try {
        console.log('Iniciando proceso de seeding...');
        connection = await getConnection();

        const transaction = new sql.Transaction(connection);
        await transaction.begin();

        try {
            console.log('Limpiando tablas existentes...');
            const clearReq = new sql.Request(transaction);
            await clearReq.query(`
                DELETE FROM RECETA_INGREDIENTE;
                DELETE FROM RECETA_ETIQUETA;
                DELETE FROM INSTRUCCIONES;
                DELETE FROM RECETA;
                DELETE FROM INGREDIENTE;
                DELETE FROM USUARIO;
                DELETE FROM COCCION;
                DELETE FROM ETIQUETA;
            `);

            // 2. Insertar tipos de cocción por defecto
            console.log('Insertando tipos de cocción...');
            const cocciones = [
                { id: 1, nombre: 'Sartén / Fuego Directo', desc: 'Cocción rápida en sartén o fuego directo', factor: 1.0 },
                { id: 2, nombre: 'Hervido', desc: 'Cocción en agua hirviendo', factor: 0.8 },
                { id: 3, nombre: 'Frito', desc: 'Cocción sumergido en aceite caliente', factor: 1.5 }
            ];

            let coccionSql = 'SET IDENTITY_INSERT COCCION ON;\n';
            for (const c of cocciones) {
                const nombreEscaped = c.nombre.replace(/'/g, "''");
                const descEscaped = c.desc.replace(/'/g, "''");
                coccionSql += `INSERT INTO COCCION (id_coccion, nombre_tipo, descripcion, factor_calorico) VALUES (${c.id}, '${nombreEscaped}', '${descEscaped}', ${c.factor});\n`;
            }
            coccionSql += 'SET IDENTITY_INSERT COCCION OFF;\n';

            const coccionReq = new sql.Request(transaction);
            await coccionReq.query(coccionSql);


            // 3. Insertar Etiquetas por defecto
            console.log('Insertando etiquetas...');
            const etiquetas = [
                { id: 1, nombre: 'Carnes' },
                { id: 2, nombre: 'Ensaladas' },
                { id: 3, nombre: 'Pastas' },
                { id: 4, nombre: 'Tacos' },
                { id: 5, nombre: 'Desayunos' }
            ];

            let etiquetaSql = 'SET IDENTITY_INSERT ETIQUETA ON;\n';
            for (const e of etiquetas) {
                const nombreEscaped = e.nombre.replace(/'/g, "''");
                etiquetaSql += `INSERT INTO ETIQUETA (id_etiqueta, nombre_etiqueta) VALUES (${e.id}, '${nombreEscaped}');\n`;
            }
            etiquetaSql += 'SET IDENTITY_INSERT ETIQUETA OFF;\n';

            const etiquetaReq = new sql.Request(transaction);
            await etiquetaReq.query(etiquetaSql);


            // 4. Leer e Insertar Usuarios
            console.log('Cargando usuarios desde users.json...');
            const usersFile = path.resolve('./users.json');
            const usersData = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));

            let userCounter = 1;
            const mappedUsers = [];
            const usersToInsert = [];

            for (const u of usersData) {
                const email = (u.email || `usuario${userCounter}@mail.com`).toLowerCase().trim();

                if (mappedUsers.includes(email)) {
                    continue;
                }
                mappedUsers.push(email);

                const id = u.id_usuario || userCounter;
                const nombre = u.nombre || 'Usuario';
                const apellido = u.apellido || 'Pérez';
                const rawPassword = u.password || '1234';

                const hash = await bcrypt.hash(rawPassword, 10);
                usersToInsert.push({ id, nombre, apellido, email, hash });

                userCounter = Math.max(userCounter, id) + 1;
            }

            let usuarioSql = 'SET IDENTITY_INSERT USUARIO ON;\n';
            for (const u of usersToInsert) {
                const nombreEscaped = u.nombre.replace(/'/g, "''");
                const apellidoEscaped = u.apellido.replace(/'/g, "''");
                const emailEscaped = u.email.replace(/'/g, "''");
                const hashEscaped = u.hash.replace(/'/g, "''");
                usuarioSql += `INSERT INTO USUARIO (id_usuario, nombre, apellido, email, contraseña) VALUES (${u.id}, '${nombreEscaped}', '${apellidoEscaped}', '${emailEscaped}', '${hashEscaped}');\n`;
            }
            usuarioSql += 'SET IDENTITY_INSERT USUARIO OFF;\n';

            const usuarioReq = new sql.Request(transaction);
            await usuarioReq.query(usuarioSql);


            // 5. Leer e Insertar Ingredientes con iconos y valores nutricionales por defecto
            console.log('Cargando ingredientes desde ingredients.json...');
            const ingFile = path.resolve('./ingredients.json');
            const ingData = JSON.parse(fs.readFileSync(ingFile, 'utf-8'));

            const defaultIngredientsData = {
                'harina': { icono: '🌾', cal: 364, prot: 10, carbs: 76, gras: 1 },
                'leche': { icono: '🥛', cal: 42, prot: 3.4, carbs: 5, gras: 1 },
                'lechuga': { icono: '🥬', cal: 15, prot: 1.4, carbs: 2.9, gras: 0.2 },
                'pollo': { icono: '🍗', cal: 165, prot: 31, carbs: 0, gras: 3.6 },
                'carne': { icono: '🥩', cal: 250, prot: 26, carbs: 0, gras: 15 },
                'pan': { icono: '🍞', cal: 265, prot: 9, carbs: 49, gras: 3.2 },
                'pasta': { icono: '🍝', cal: 131, prot: 5, carbs: 25, gras: 1.1 },
                'crema': { icono: '🥛', cal: 345, prot: 2, carbs: 3, gras: 37 },
                'tortilla': { icono: '🫓', cal: 218, prot: 6, carbs: 45, gras: 3 },
                'zanahoria': { icono: '🥕', cal: 41, prot: 0.9, carbs: 10, gras: 0.2 },
                'papa': { icono: '🥔', cal: 77, prot: 2, carbs: 17, gras: 0.1 },
                'pan rallado': { icono: '🍞', cal: 395, prot: 13, carbs: 72, gras: 5 },
                'huevo': { icono: '🥚', cal: 155, prot: 13, carbs: 1.1, gras: 11 },
                'queso': { icono: '🧀', cal: 402, prot: 25, carbs: 1.3, gras: 33 },
                'arroz': { icono: '🍚', cal: 130, prot: 2.7, carbs: 28, gras: 0.3 },
                'cebolla': { icono: '🧅', cal: 40, prot: 1.1, carbs: 9, gras: 0.1 },
                'ajo': { icono: '🧄', cal: 149, prot: 6.4, carbs: 33, gras: 0.5 },
                'aceite de oliva': { icono: '🫒', cal: 884, prot: 0, carbs: 0, gras: 100 },
                'sal': { icono: '🧂', cal: 0, prot: 0, carbs: 0, gras: 0 }
            };

            let ingredienteSql = 'SET IDENTITY_INSERT INGREDIENTE ON;\n';

            for (const ing of ingData) {
                const nombre = ing.nombre.trim();
                const nombreEscaped = nombre.replace(/'/g, "''");
                const key = nombre.toLowerCase();
                const info = defaultIngredientsData[key] || { icono: '🍎', cal: 50, prot: 1.5, carbs: 10, gras: 0.5 };
                const iconoEscaped = info.icono.replace(/'/g, "''");

                ingredienteSql += `INSERT INTO INGREDIENTE (id_ingrediente, nombre, calorias_por100g, proteinas_por100, carbs_por100, grasas_por100g, icono, id_coccion) VALUES (${ing.id_ingrediente}, '${nombreEscaped}', ${info.cal}, ${info.prot}, ${info.carbs}, ${info.gras}, '${iconoEscaped}', NULL);\n`;
            }
            ingredienteSql += 'SET IDENTITY_INSERT INGREDIENTE OFF;\n';

            const ingredienteReq = new sql.Request(transaction);
            await ingredienteReq.query(ingredienteSql);


            // 6. Leer e Insertar Recetas, sus ingredientes relacionales e instrucciones
            console.log('Cargando recetas desde recipes.json...');
            const recFile = path.resolve('./recipes.json');
            const recData = JSON.parse(fs.readFileSync(recFile, 'utf-8'));

            let recetaSql = 'SET IDENTITY_INSERT RECETA ON;\n';
            let relacionesSql = '';

            for (const r of recData) {
                const infoNutri = r.info_nutricional || {};
                const proteinas = infoNutri.proteinas_totales || 0;
                const grasas = infoNutri.grasas_totales || 0;
                const carbs = infoNutri.carbs_totales || 0;
                const calorias = infoNutri.aporte_calorico_total || 0;

                const nombreEscaped = r.nombre_receta.replace(/'/g, "''");
                const descEscaped = (r.descripcion || '').replace(/'/g, "''");
                const imagenEscaped = (r.imagen || '').replace(/'/g, "''");
                const dificultadEscaped = (r.dificultad || 'Fácil').replace(/'/g, "''");

                recetaSql += `
                    INSERT INTO RECETA (
                        id_receta, nombre_receta, descripcion, porcion, imagen, tiempo_total, 
                        dificultad, fecha_creacion, proteinas_totales, grasas_totales, 
                        carbs_totales, aporte_calorico_total, id_coccion, id_usuario
                    ) VALUES (
                        ${r.id_receta}, '${nombreEscaped}', '${descEscaped}', ${r.porcion || 1}, '${imagenEscaped}', ${r.tiempo_total || 10}, 
                        '${dificultadEscaped}', GETDATE(), ${proteinas}, ${grasas}, 
                        ${carbs}, ${calorias}, ${r.id_coccion || 1}, ${r.id_usuario || 1}
                    );\n`;

                if (r.instrucciones) {
                    const instEscaped = r.instrucciones.replace(/'/g, "''");
                    relacionesSql += `INSERT INTO INSTRUCCIONES (id_receta, num_paso, instruccion, imagen) VALUES (${r.id_receta}, 1, '${instEscaped}', NULL);\n`;
                }

                if (Array.isArray(r.ingredientes)) {
                    for (let i = 0; i < r.ingredientes.length; i++) {
                        const ing = r.ingredientes[i];
                        const unidadEscaped = (ing.unidad || 'unidad').replace(/'/g, "''");
                        relacionesSql += `INSERT INTO RECETA_INGREDIENTE (id_receta, id_ingrediente, cantidad, unidad, orden) VALUES (${r.id_receta}, ${ing.id_ingrediente}, ${ing.cantidad}, '${unidadEscaped}', ${i + 1});\n`;
                    }
                }

                if (r.id_etiqueta) {
                    relacionesSql += `INSERT INTO RECETA_ETIQUETA (id_receta, id_etiqueta, prioridad) VALUES (${r.id_receta}, ${r.id_etiqueta}, 1);\n`;
                }
            }

            recetaSql += 'SET IDENTITY_INSERT RECETA OFF;\n';

            // Insertar todas las recetas primero
            const recetaReq = new sql.Request(transaction);
            await recetaReq.query(recetaSql);

            // Luego insertar todas las relaciones e instrucciones
            if (relacionesSql) {
                const relacionesReq = new sql.Request(transaction);
                await relacionesReq.query(relacionesSql);
            }

            // Confirmar transacción
            await transaction.commit();
            console.log('¡Seeding completado con total éxito de forma transaccional!');
        } catch (innerError) {
            console.error('Error dentro de la transacción, haciendo rollback...', innerError);
            await transaction.rollback();
            throw innerError;
        }

    } catch (error) {
        console.error('Error durante el proceso de seeding:', error);
    } finally {
        if (connection) {
            await connection.close();
            console.log('Conexión cerrada.');
        }
    }
}

seed();
