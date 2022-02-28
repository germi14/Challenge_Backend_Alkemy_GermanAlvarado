//Funcion para generar el JSON WEB TOKEN (JWT), el cual sera asignado al usuario cuando haga el login
// Este JWT sera utilizado como validacion para realizar las peticiones CRUD a las tablas de Personajes y Peliculas

const jwt = require('jsonwebtoken')

const generarJWT = (id='') => {

    return new Promise ( (resolve, reject) => {

        const payload = { id }; 

        jwt.sign(payload, process.env.SECRETOPRIVATEKEY, // Esta llave secreta es para firmar el token y se encuentra declarada como una variable de entorno
            { expiresIn: '10h' }, 
            (err, token) =>{
                if (err){
                    reject('No se pudo generar el token')
                }else {
                    resolve( token );
                }
            })
    })
}

module.exports = {
    generarJWT
}