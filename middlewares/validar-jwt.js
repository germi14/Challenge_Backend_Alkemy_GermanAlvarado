//Este middelware es para validar si el JWT generado es valido//

const jwt = require('jsonwebtoken');

const { response, request } = require('express');

const {Usuario} = require('../db/connection');


const validarJWT = async (req = request, res = response, next) =>{

    const token = req.header('token'); 

    if(!token) {
        return res.status(401).json( { msg: 'No hay token en la peticion' } );
    }
    try{
        const { id } = jwt.verify( token, process.env.SECRETOPRIVATEKEY);

        req.id = id;

        const usuario = await Usuario.findOne( { where: {id} } );

        if(!usuario){
            return res.status(401).json( { msg: 'Token no es valido - Usuario no existe en la BD' } )
        }

        next();

    } catch(err) {
        res.status(401).json( { msg: 'Token no es valido' } )
    }
}

module.exports = {
    
    validarJWT
}