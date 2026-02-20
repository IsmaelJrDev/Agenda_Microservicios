// Este Middleware nos sirve para poder validar si puede ingresar y hacer una consulta  a la base de ddatos

const jwt = require("jsonwebtoken");

// Middleware para validar el token de autenticación "Estrcutura especial de Express" 
module.exports = (req, res, next) => {
    // El simbolo de interrogación es para validar si existe el header de autorización, si no existe no se rompe la aplicación y se asigna un valor undefined al token, la posicion 1 del arreglo es para extraer solo el token sin la palabra "Bearer", ya que nos llega en el formato ["Bearer token"] => ["Bearer, 162bnlnadiokmda341414dwqd"]
    const token = req.headers.authorization?.split(" ")[1]; // Extraer el token del header del navegador Authorization

    // Validar si el token existe, si no existe se devuelve un error 401 (Unauthorized)
    if (!token) return res.status(401).json({
        message: "No token provided"
    })

    // Validar el token, si es válido se decodifica, pero debe verificar el token, y adelante la palabra secreta que se uso para generar el token en el microservicio 1
    try {
        const decoded = jwt.verify(
            token, 
            "12j1ljh2lh1lhlh1ljhlj3hl13llkjl"
        );
        req.user = decoded; // Guardamos el usuario decodificado en la solicitud para usarlo en los controladores
        next(); // Salimos de nuestro middleware
    } catch (error) {
        // Si el token no es válido, se devuelve un error 403 (Forbidden) el cual se refiere a que el servidor entendió la solicitud pero se niega a autorizarla, esto es porque el token no es válido o ha expirado
        res.status(403).json({
            message: "Invalid token "
        })
    }
}