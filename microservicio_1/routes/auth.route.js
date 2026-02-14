// Archivo de rutas para app

const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const { response } = require("express");


// Endpoint para registrar usuario con metodo post
router.post("/register", async(req, res)=>{
    try{
        // Capturamos el email y password
        const {email, password} = req.body;

        // Convertir contraseña a encriptada
        const passhash = await bcrypt.hash(password, 10);

        // Creación de un usuario
        const user = await User.create({
            email,  // Pasamos el correo tal cual
            password: passhash, // Guardamos contraseña ya hasheada
        })

        // No debe de ir en un entorno real pero con fines practicos se usa
        res.status(201).json(user);
        //res.status(201).json({message: "Usuario creado"})

    }catch (error){
        res.status(400).json({
            message: "Usuario no encontrado " + error.message || " "
        });
    }
})

router.post("/login", async(req, res)=>{
    try{
        // Capturamos el email y password
        const {email, password} = req.body;

        // Busca si el usuario existe
        const user = await User.findOne({email});

        // Sis no se encuentra el usuario
        if (!user) return res.status(404).json({
            message: "Fijate que no esta"
        });

        // Comparar contraseña hasheada y no hasheada, y se guarda en valid si es verdadero o falso
        const valid = await bcrypt.compare(password, user.password);

        // Si la contraseña no es valida
        if (!valid) return res.status(401).json({
            message: "Bueno tu estas pendejo o que...?"
        })

        // Generamos el token
        const token = jwt.sign(
            {id:user._id, email:user.email},
            "12j1ljh2lh1lhlh1ljhlj3hl13llkjl",
            {expiresIn:"1d"}
        )

        // Si todo esta correcto
        res.status(200).json({token})
    }catch(error){
        // Si existe algun otro error interno
        res.status(500).json({
            message: error.message || "No pudo procesarse la solicitud"
        })
    }
});

module.exports = router;