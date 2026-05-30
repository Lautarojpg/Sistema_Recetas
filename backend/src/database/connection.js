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

let poolPromise;

export function getConnection() {
    if (!poolPromise) {
        poolPromise = sql.connect(config)
            .then(pool => {
                console.log('Conectado a SQL Server');
                return pool;
            })
            .catch(err => {
                console.error('Error al conectar a SQL Server:', err);
                poolPromise = null; // Reintentar en la próxima llamada
                throw err;
            });
    }
    return poolPromise;
}
