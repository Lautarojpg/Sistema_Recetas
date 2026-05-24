import sql from 'mssql';

const config = {
    user: 'app_recetas',
    password: '123456',
    server: 'localhost',
    database: 'busqueda_receta',
    options: {
        trustServerCertificate: true
    }
};

export async function getConnection() {
    try {
        return await sql.connect(config);
    } catch (error) {
        console.error(error);
    }
}