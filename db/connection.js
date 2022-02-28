const { Sequelize, DataTypes } = require('sequelize');

const usuarioModelo = require('../models/usuario');
const personajeModelo = require('../models/personaje');
const peliculaModelo = require('../models/pelicula');
const generoModelo = require('../models/genero');

const { crearGenero } = require('../helpers/crearGeneros');

//Configuracion de la base de datos
const db = new Sequelize(process.env.NombreBD, process.env.UserBD, process.env.PasswordBD, {
    host: process.env.HostBD,
    dialect: process.env.DialectBD
});

const Usuario = usuarioModelo( db, DataTypes );
const Personaje = personajeModelo( db, DataTypes );
const Pelicula = peliculaModelo( db, DataTypes );
const Genero = generoModelo(db, DataTypes);

//Sincronizacion de la base de datos
db.sync({ force:false })
    .then(()=>{
        console.log('tablas sincronizadas')
    });


//Creacion de las relaciones entre las tablas
Genero.hasMany(Pelicula);
Pelicula.belongsTo(Genero);

Personaje.belongsToMany(Pelicula, { through: 'PersonajePelicula' });
Pelicula.belongsToMany(Personaje, { through: 'PersonajePelicula' });

//Creacion de la tabla Genero
crearGenero(Genero)

module.exports = {
    db,
    Usuario,
    Personaje,
    Pelicula,
    Genero
}