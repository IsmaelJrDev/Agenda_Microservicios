# Sistema de Agenda con Microservicios

Proyecto escolar desarrollado en la materia de **Sistemas Distribuidos** — 8vo semestre, Ingeniería en Sistemas Computacionales.

El objetivo fue aprender a diseñar e implementar una arquitectura de microservicios con bases de datos distribuidas, balanceo de carga y autenticación entre servicios.

---

## Arquitectura

![Diagrama de arquitectura](assets/Arquitectura.svg)

El sistema está compuesto por:

- **Nginx** — API Gateway que recibe todas las peticiones y las distribuye entre los microservicios usando round-robin
- **Microservicio 1** — Manejo de usuarios: registro y login con JWT
- **Microservicio 2** — CRUD de contactos de agenda, protegido por el token generado en el Microservicio 1
- **Cluster MongoDB rs0** — 3 nodos en replica set para el Microservicio 1
- **Cluster MongoDB rs1** — 3 nodos en replica set para el Microservicio 2

Cada microservicio corre en 2 réplicas simultáneas, y Nginx distribuye el tráfico entre ellas.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Lenguaje | JavaScript (Node.js) |
| Framework | Express 5 |
| Base de datos | MongoDB 7 (Replica Sets) |
| ODM | Mongoose |
| Autenticación | JWT + bcryptjs |
| API Gateway | Nginx |
| Contenedores | Docker / Docker Compose |

---

## Estructura del proyecto

```
.
├── docker-compose.yaml       # Orquestación de todos los servicios
├── nginx/
│   └── nginx.conf            # Configuración del API Gateway
├── microservicio_1/          # Servicio de autenticación
│   ├── models/User.js
│   ├── routes/auth.route.js
│   └── index.js
└── microservicio_2/          # Servicio de contactos
    ├── models/Contact.js
    ├── routes/contacts.routes.js
    ├── middleware/auth.middleware.js
    └── index.js
```

---

## Cómo levantar el proyecto

### Requisitos previos

- Docker Engine >= 20.10
- Docker Compose >= 2.0

### 1. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 2. Generar el keyfile para MongoDB

Solo es necesario la primera vez:

```bash
openssl rand -base64 756 > mongo-keyfile
chmod 600 mongo-keyfile
sudo chown 999:999 mongo-keyfile
```

> Se necesitan **dos keyfiles** con nombres distintos: `mongo-keyfile` (para rs0) y `mongo-Keyfile` (para rs1). Repetir el comando con el segundo nombre.

### 3. Levantar los contenedores

```bash
docker-compose up -d
```

### 4. Inicializar los replica sets

Una sola vez, después de que los contenedores estén corriendo:

```bash
# Replica set rs0 (Microservicio 1)
docker exec -it mongoUno mongosh -u admin -p <tu_password>
```

```js
rs.initiate({
  _id: 'rs0',
  members: [
    { _id: 0, host: 'mongoUno:27017' },
    { _id: 1, host: 'mongoDos:27017' },
    { _id: 2, host: 'mongoTres:27017' }
  ]
})
```

```bash
# Replica set rs1 (Microservicio 2)
docker exec -it mongoCuatro mongosh -u admin -p <tu_password>
```

```js
rs.initiate({
  _id: 'rs1',
  members: [
    { _id: 3, host: 'mongoCuatro:27017' },
    { _id: 4, host: 'mongoCinco:27017' },
    { _id: 5, host: 'mongoSeis:27017' }
  ]
})
```

### 5. Crear el usuario admin en MongoDB

Dentro de la shell del nodo primario:

```js
use admin
db.createUser({
  user: "admin",
  pwd: "<tu_password>",
  roles: [{ role: "root", db: "admin" }]
})
```

---

## Endpoints disponibles

### Microservicio 1 — Usuarios (`/api1`)

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api1/api/users/register` | Registrar usuario | No |
| POST | `/api1/api/users/login` | Login, retorna JWT | No |

### Microservicio 2 — Contactos (`/api2`)

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api2/api/contacts` | Crear contacto | Sí |
| GET | `/api2/api/contacts` | Listar contactos del usuario | Sí |
| PUT | `/api2/api/contacts/update/:id` | Actualizar contacto | Sí |
| DELETE | `/api2/api/contacts/delete/:id` | Eliminar contacto | Sí |

Para las rutas protegidas, incluir el header:
```
Authorization: Bearer <token>
```

---

## Aprendizajes

- Diseño e implementación de una arquitectura de microservicios con responsabilidades separadas
- Configuración de replica sets en MongoDB con autenticación mediante keyfiles
- Uso de Nginx como API Gateway con load balancing round-robin
- Comunicación entre microservicios mediante JWT para proteger rutas sin acoplamiento directo
- Orquestación de múltiples servicios con Docker Compose

---

## Notas

Este proyecto fue desarrollado con fines educativos. Para un entorno de producción habría que considerar: manejo de errores robusto, variables de entorno para todos los secretos, inicialización automática de los replica sets e imágenes Docker optimizadas.

Ver [`MEJORAS.md`](MEJORAS.md) para el detalle técnico de lo que se mejoraría.