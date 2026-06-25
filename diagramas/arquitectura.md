# Arquitectura del Sistema: Cliente-Servidor y Capas

El sistema está diseñado bajo un modelo híbrido que combina la arquitectura **Cliente-Servidor** con una arquitectura de **N-Capas (o Capas Lógicas)** en el backend y el frontend. Esta separación de responsabilidades asegura modularidad, facilidad de mantenimiento y desacoplamiento entre la interfaz de usuario, las reglas de negocio y el almacenamiento de datos.

---

## Diagrama de Arquitectura (Mermaid)

El siguiente diagrama detalla cómo se estructuran las capas lógicas y cómo fluye la información entre el Cliente (Frontend) y el Servidor (Backend) a través de llamadas RESTful.

```mermaid
flowchart TB
    %% Estilos de los nodos
    classDef client fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#01579b;
    classDef server fill:#efebe9,stroke:#8d6e63,stroke-width:2px,color:#3e2723;
    classDef route fill:#fff9c4,stroke:#fbc02d,stroke-width:2px,color:#f57f17;
    classDef logic fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#1b5e20;
    classDef db fill:#ffe0b2,stroke:#ff9800,stroke-width:2px,color:#e65100;

    subgraph CLIENTE ["Cliente - Frontend React.js / Vite"]
        UI["Capa de Presentacion - React Components y Pages"]
        FService["Capa de Servicios de Red - api.js / Axios"]
        UI -->|Invoca funciones de servicio| FService
    end

    subgraph NETWORK ["Canal de Comunicacion - Internet"]
        HTTP["Protocolo HTTP - Endpoints REST / JSON"]
    end

    subgraph SERVIDOR ["Servidor - Backend Node.js / Express"]
        %% Capa de Entrada y Ruteo
        Routes["Rutas - routes.js / recetaRoutes.js"]
        Middlewares["Middlewares - authMiddleware / CORS"]
        Controllers["Controladores - RecetaController"]
        
        %% Capa de Lógica de Negocio
        Services["Servicios - RecetaService"]

        %% Capa de Dominio / Entidades
        Models["Modelos de Dominio - Receta.js"]
        Builders["Patron Builder - RecetaBuilder.js"]

        %% Capa de Acceso a Datos
        Repositories["Repositorios - RecetaRepository"]
        DBConnection["Gestor de Conexion - connection.js"]

        %% Relaciones internas del servidor
        Routes -->|Aplica| Middlewares
        Middlewares -->|Despacha a| Controllers
        Controllers -->|Invoca| Services
        Services -->|Construye| Builders
        Builders -->|Crea| Models
        Services -->|Persiste / Recupera datos| Repositories
        Repositories -->|Obtiene conexion activa| DBConnection
    end

    subgraph BASE_DATOS ["Persistencia - Base de Datos"]
        SQLServer[("Microsoft SQL Server - Tablas y Stored Procedures")]
    end

    %% Relaciones de flujo de datos (Ida)
    FService -->|Peticion HTTP Request| HTTP
    HTTP -->|Rutea hacia el Backend| Routes
    Repositories -->|Ejecuta Queries / Stored Procedures| SQLServer
    
    %% Relaciones de flujo de datos (Vuelta)
    SQLServer -.->|Recordsets de base de datos| Repositories
    Services -.->|Datos de negocio procesados| Controllers
    Controllers -.->|Respuesta HTTP JSON Response| HTTP
    HTTP -.->|Datos JSON| FService
    FService -.->|Actualiza Estado| UI

    %% Aplicar clases
    class UI,FService client;
    class Routes,Middlewares,Controllers route;
    class Services logic;
    class Models,Builders logic;
    class Repositories,DBConnection db;
    class SQLServer db;
```

---

## Descripción Detallada de las Capas

### 1. Cliente (Frontend - React + Vite)
El frontend actúa como la interfaz interactiva para el usuario final. Está desacoplado del backend y se compone de:
*   **Capa de Presentación (React Components & Pages):** Gestiona la UI y el estado de la vista. Se encarga de pintar elementos visuales como formularios de recetas, listados, barras de búsqueda y filtros.
*   **Capa de Servicios de Red (`src/services/api.js`):** Encapsula todas las llamadas HTTP al backend. Esto previene que los componentes interactúen directamente con URLs de la API, centralizando el manejo de peticiones y cabeceras de autorización.

### 2. Protocolo de Comunicación
*   **HTTP / REST (JSON):** El canal que une frontend y backend. Las peticiones viajan mediante verbos HTTP estándar (`GET`, `POST`, `PUT`, `DELETE`) y el payload es estructurado en formato JSON.

### 3. Servidor (Backend - Node.js + Express)
El backend procesa las solicitudes recibidas y aplica las reglas de negocio sobre los datos persistidos. Se organiza en las siguientes capas lógicas:

#### A. Capa de Entrada y Ruteo (Rutas, Middlewares y Controladores)
Es la puerta de entrada a la aplicación.
*   **Rutas (`routes/`):** Definen los endpoints de la API expuestos al cliente (ej. `/api/recetas`).
*   **Middlewares (`middlewares/`):** Funciones intermedias para interceptar peticiones. Principalmente manejan el control de acceso y validación de tokens de sesión (`authMiddleware`).
*   **Controladores (`controllers/`):** Extraen los parámetros de la petición HTTP (body, query params, path params), invocan la capa de negocio y serializan el resultado de vuelta como una respuesta JSON o código de estado HTTP adecuado.

#### B. Capa de Lógica de Negocio (Servicios)
*   **Servicios (`services/`):** Aquí vive el core de las reglas del negocio (ej. `RecetaService.js`). Realiza validaciones conceptuales (como verificar ingredientes válidos, duplicados o calcular información nutricional) antes de orquestar operaciones con la persistencia.

#### C. Capa de Dominio / Entidades
*   **Modelos y Builders (`models/`):** Representa el modelo lógico del dominio de recetas. Se utiliza el **Patrón Builder** (`RecetaBuilder.js`) para instanciar recetas complejas paso a paso con validaciones estructurales propias del objeto de dominio (`Receta.js`).

#### D. Capa de Acceso a Datos (Repositorios)
*   **Repositorios (`repositories/`):** Abstraen el origen de los datos (ej. `RecetaRepository.js`). Encapsulan la lógica SQL y la ejecución de procedimientos almacenados. De esta forma, si el motor de base de datos cambiara en el futuro, solo se modificaría esta capa.
*   **Conexión (`database/connection.js`):** Gestiona el pool de conexiones activas con Microsoft SQL Server usando el controlador `mssql`.

#### E. Base de Datos (Persistencia)
*   **Microsoft SQL Server:** Almacena físicamente las tablas relacionales (`RECETA`, `INGREDIENTE`, `INSTRUCCIONES`, etc.) y expone lógica en base de datos mediante **Procedimientos Almacenados (Stored Procedures)** como `sp_crear_receta` y `sp_agregar_instruccion`.

---

## Patrones de Diseño Clave Utilizados

1.  **Patrón Repository (Repositorio):** Aísla la capa de negocio de los detalles de SQL Server.
2.  **Patrón Builder (Constructor):** Facilita la creación del objeto complejo `Receta` configurando dinámicamente sus ingredientes, instrucciones e información nutricional paso a paso.
3.  **Separación de Conceptos (SoC - Separation of Concerns):** El frontend no sabe cómo se guardan los datos en SQL Server; el backend no sabe cómo se renderizan los datos en React.
