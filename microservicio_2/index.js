const express = require('express');
const mongoose = require('mongoose');
const contactsRoutes = require("./routes/contacts.routes");
const cors = require("cors");   // Importamos el middleware de CORS para permitir solicitudes desde el frontend

// Creamos nuestro servidor Express
const app = express();

app.use(cors()); // Usamos el middleware de CORS para permitir solicitudes desde el frontend
app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes como JSON

app.use("/api/contacts", contactsRoutes); // Usamos las rutas de contactos

// Conexión a la base de datos
mongoose.connect("mongodb://localhost:27017")
.then(()=>{
    app.listen(3001,()=>console.log("Servidor 2 corriendo"));
}).catch((err)=>{
    console.log("El servidor 2 no jala :(" + err);
});
