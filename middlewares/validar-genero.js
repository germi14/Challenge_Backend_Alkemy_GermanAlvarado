//Este middelware es para validar si existe el genero con el nombre de genero ingresado

const { response, request } = require('express');
const { Genero } = require('../db/connection');

const generoValido = async (req = request, res = response, next) => {

    const {genero} = req.body;

    if(genero){
        const existeGenero = await Genero.findOne( { where: { nombre: genero } } );
        if ( !existeGenero ){
            res.status(401).json(`El genero ${genero} no existe, debe ingresar un genero entre las opciones: Animacion - Fantasia - Musical - Aventura - Accion`)
        }
    }
    next();
}

module.exports = {
    
    generoValido
}