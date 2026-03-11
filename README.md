# Backend del Sistema de Agenda con Sistemas Distribuidos

Backend del sistema creado en la materia de Sistemas Distribuidos en el 8vo semestre de la carrera de Ingenieria en Sistemas Computacionales.


## Stack Tecnológico

- **Base de datos:** MongoDB
- **Microservicios:** Docker
- **Lenguaje:** JavaScript
- **Backend:** Node.js

## Herramientas de desarrollo

- **Visual Studio Code**
- **Postman**
- **Linux**
- **Docker**

## División de microservicios

### Microservicio_1

En este microservicio se realiza la parte de logueo, usando `bycrypt`  para poder tener una mejor seguridad con el hasheo de contraseñas, ademas de usar `jwt` para poder crear un token de logueo.

### Microservicio_2

En este, una vez ya logueados vamos a poder crear, eliminar, modificar y obtener contactos por medio de la api que se creo, es decir un tipo CRUD. Esto lo podemos proar hacieno uso de **Postman** pasandole el token de logueo por la parte de header

## API Gateway

Estamos haciendo uso de **Ngnix** para crear la API Gateway, todas estas configuraciones se encuentran en el archivo de ```nginx.conf``` dentro de la carpeta de **nginx**

## Diagrama de Arquitectura del sistema

![Diagram](assets/Arquitectura.svg)

## Clusters

Los clusters de las bases de datos etan declarados en la carpeta cluster, en el archivo de ```docker compose.yaml``` donde se delaran los puertos donde se vana  comunicar mediante la pc del servidor en este caso.

Aqui usamos la imagen de mongo y declaramos un nombre al contenedor para poder identificarlo mas facilmente.

### Congiguracion de llaves KeyFile (necesarias para Cluster)


Ejecuta lo siguinete por cluster

```sh
# Generar la llave de keyfile
openssl rand -base64 756 >cluster/mongo-keyfile

# Permisos 
chmod 600 cluster/mongo-keyfile

# Permisos a grupos
sudo chown 999:999 clsuter/mongo-keyfile
```

Levantamos contenedores, una vez levantados vamos a ejecutar el siguiente comando:
```sh
docker exec -it mongoUno mongosh
```

### Declarar los contenedores para los cluster

Primer Cluster para la parte de logueo de usuarios

```sh
rs.initiate({
     _id: 'rs0', 
     members: [ 
        { _id: 0, host: 'mongoUno:27017' }, 
        { _id: 1, host: 'mongoDos:27017' }, 
        { _id: 2, host: 'mongoTres:27017' }
        ] 
        })
```

Segundo Cluster para la parte de contactos

```sh
rs.initiate({
      _id: 'rs1', 
      members: [ 
         { _id: 3, host: 'mongoCuatro:27017' }, 
         { _id: 4, host: 'mongoCinco:27017' }, 
         { _id: 5, host: 'mongoSeis:27017' }
         ] 
         })
```

### Para poder crear un usuario en la base de datos de mongosh 

Para poder ingresar como admin para crear el usuario, primero debemos asegurarnos estar en la replica que se considera primary.

Para poder veirificar que estas en la correcta usaremos el comando:

```sh
rs.status()
```

Aqui buscaremos en el resultado de la consola, cual es la ```primary```:

Una vez encontrada esta, vamos a ingresar con el sigiuente comando: 
```sh
docker exec -it mongoUno mongosh
```

En esta base de datos es donde ingresamos y creamos el usuario.

```sh
use admin
```

Para poder crear nuetsro usuario, cambia los datos por los que vas a usar.

```sh
db.createUser({
  user: "admin",
  pwd: "admin123",
  roles: [ { role: "root", db: "admin" } ]
})

```

Para poder ingresar con contraseña seria el siguiente comando, necesario para poder hacer la conexion a Mongo Compass:

```sh
docker exec -it mongoUno mongosh -u admin -p admin123
```

### Para poder netrar a mongo Compass

```
mongodb://admin:040918@localhost:27018
```

Ya con esto podemos tener el cluster, es decir si en la base de datos principal hay cambios, se pueden mostrar en las replicas es decir si en la ```mongoUno``` hay cambios, la ```mongoDos``` y en la ```mongoTres```, lo mismo para el segundo cluster ```mongoCuatro``` hay cambios, la ```mongoCinco``` y en la ```mongoSeis``` se reflejaran.