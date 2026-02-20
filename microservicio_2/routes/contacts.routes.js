const router = require("express").Router();
const Contact = require("../models/Contact");
const auth = require("../middleware/auth.middleware");

// Usamos el middleware de autenticación para proteger las rutas.
router.use(auth);

// Como la base de datos es externa debemos usar asincronismo para poder hacer las consultas a la base de datos, por lo tanto usamos async/await
router.post("/",async (req, res) => {
    const contact = await Contact.create({
        userId : req.userId,
        ...req.body // Va a traer los datos que se comparten con nuestro esquema
    });
    // Respuesta del servidor con el contacto creado.
    res.status(201).json(contact);
});

router.get("/", async (req, res) => {
    // Buscar los contactos del usuario logueado
    const contacts = await Contact.find({userId: req.user.id}); 
    // Respuesta del servidor con los contactos encontrados.
    res.status(200).json(contacts);
});

// Asi se usa un middleware para una peticion en especifico y no usarlo global como arriba.
// router.get("/",auth,async (req, res) => {});

module.exports = router;