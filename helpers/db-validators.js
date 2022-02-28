//Dentro de este archivo se encuentran todas las validaciones especificas que se utilizan en algunas de las rutas para los diferentes CRUD

const moment = require('moment');

const {Usuario, Personaje, Pelicula, Genero} = require('../db/connection');


// Validacion personalizada para comprobar si el correo ingresado existe en la base de datos de Usuarios Registrados

const emailExiste = async (correo = '') => {

    if(!correo){
        throw new Error (`El correo es obligatorio, debe ingresar este campo`);
    }

    const existeEmail = await Usuario.findOne( {
        where:{correo}
    });

    if ( existeEmail ){
        throw new Error (`El correo ${correo} ya esta registrado`)
    }
}

//Validacion personalizada para comprobar si existe un Personaje para el id ingresado

const existePersonajePorId = async (id) => {

    const existePersonaje = await Personaje.findOne( { where: {id} } );

    if ( !existePersonaje ) {
        throw new Error(`El Personaje con el id ${ id } no existe`);
    }
}

//Validacion personalizada para comprobar si existe una Pelicula para el id ingresado

const existePeliculaPorId = async (id) => {

    const existePelicula = await Pelicula.findOne( { where: {id} } );

    if ( !existePelicula ) {
        throw new Error(`La Pelicula con el id ${ id } no existe`);
    }
}

//Validacion personalizada para comprobar si ya existe una pelicula con el titulo ingresado

const peliculaExiste = async (titulo = '') => {

    if(titulo!== ''){
        const existePelicula = await Pelicula.findOne( { where: {titulo} });
        
        if ( existePelicula ){
            throw new Error (`La pelicula ${titulo} ya existe`)
        }
    }
}

//Validacion personalizada para comprobar si no existe una pelicula con el titulo ingresado

const peliculaNoEncontrada = async (titulo = '') => {

    if(!titulo){
        throw new Error (`El titulo de la pelicula es obligatorio, debe ingresar este campo`);
    }

    const existePelicula = await Pelicula.findOne( {where: {titulo} } );

    if (!existePelicula ){
        throw new Error (`La pelicula ${titulo} no existe en la base de datos, debe ingresar una pelicula valida o crear la pelicula primero`)
    }
}

//Validacion personalizada para comprobar si la fecha ingresada cumple con los formatos validos

const fechaValida = async (fechaCreacion = '') => {

    if(fechaCreacion!== ''){
        let fecha = moment(fechaCreacion, 'YYYY/MM/DD' , true).isValid();
            if(!fecha){
                fecha = moment(fechaCreacion, 'YYYY-MM-DD' , true).isValid();
                    if(!fecha){
                        throw new Error (`La fecha ${fechaCreacion} debe tener un formato YYYY-MM-DD o YYYY/MM/DD`)
                    }
            }
    }
}

module.exports = {
    emailExiste,
    existePersonajePorId,
    existePeliculaPorId,
    peliculaExiste,
    fechaValida,
    peliculaNoEncontrada,
}