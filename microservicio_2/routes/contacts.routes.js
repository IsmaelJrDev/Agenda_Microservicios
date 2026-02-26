const router = require("express").Router();
const Contact = require("../models/Contact");
const auth = require("../middleware/auth.middleware");

// Usamos el middleware de autenticación para proteger las rutas.
router.use(auth);

// Como la base de datos es externa debemos usar asincronismo para poder hacer las consultas a la base de datos, por lo tanto usamos async/await

// Ruta para crear un nuevo contacto.
router.post("/",async (req, res) => {
    const contact = await Contact.create({
        userId : req.user.id,
        ...req.body // Va a traer los datos que se comparten con nuestro esquema
    });
    // Respuesta del servidor con el contacto creado.
    res.status(201).json(contact);
});

// Ruta para obtener los contactos del usuario logueado.
router.get("/", async (req, res) => {
    // Buscar los contactos del usuario logueado
    const contacts = await Contact.find({userId: req.user.id}); 
    // Respuesta del servidor con los contactos encontrados.
    res.status(200).json(contacts);
});

// Ruta para eliminar un contacto por su ID.
router.delete("/delete/:id", async (req, res) =>{
    const {id} = req.params; // Extraemos el ID del contacto a actualizar de los parámetros de la URL
    // Se busca el contacto de acuerdo al parametro id y se usa la funcion para buscarlo y eliminarlo
    const contact = await Contact.findByIdAndDelete(id);
    // En caso de no encontrar el contacto se retornasra un mensaje de contacto no encontrado
    if(!contact) return res.status(404).json({
        message: "Contacto no encontrado"
    });
    res.status(200).json("Contacto eliminado");
});


// Ruta para actualizar un contacto por su ID.
router.put("/update/:id", async (req, res) =>{
    const {id} = req.params; // Extraemos el ID del contacto a actualizar de los parámetros de la URL
    const contact = await Contact.findByIdAndUpdate(
    id,
    req.body,
    {new : true, runValidators:true}
    )
    // En caso de no encontrar el contacto se retornasra un mensaje de contacto no encontrado
    if(!contact) return res.status(404).json({
    message: "Contacto no encontrado"
    });
    res.status(200).json(contact);
});


// Asi se usa un middleware para una peticion en especifico y no usarlo global como arriba.
// router.get("/",auth,async (req, res) => {});

module.exports = router;