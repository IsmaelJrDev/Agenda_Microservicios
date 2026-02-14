const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const rutasUsuario = require("./routes/auth.route.js")

// Creamos un pequeño servidor de express
const app = express();

// Hacemos que el servidor acepte archivos json
app.use(express.json());
app.use(cors());


app.use("/api/users", rutasUsuario);

// Conexión a la base de datos
mongoose.connect("mongodb://localhost:27017")
.then(()=>{
    app.listen(3000,()=>console.log("Servidor corriendo"));
}).catch((err)=>{
    console.log("El servidor no jala :)" + err);
});