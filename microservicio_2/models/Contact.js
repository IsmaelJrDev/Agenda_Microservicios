const mongoose = require("mongoose");

// Esquema de la estructura de la tabla de contacto
const contactSchema = new mongoose.Schema({
    userId : {type: String, required: true},
    name : String,
    phone : String,
    email : String
});

// Exportar el modelo para usarlo en el resto de la aplicación
module.exports = mongoose.model("Contact", contactSchema);