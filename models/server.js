//Configuracion del servidor utilizando Express, aca se definen los path de las rutas de la aplicacion 

const express = require('express')
const cors= require('cors');

const { db } = require('../db/connection');


class Server{

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosRoutesPath = '/api/auth';
        this.peliculasPath     = '/api/movies';
        this.personajesPath      = '/api/characters';

        // Conectar a base de datos
        this.conectarDB();

        // middlewares
        this.middlewares();

        // Rutas de mi aplicacion
        this.routes();
    
    }

    async conectarDB(){
        try {
            await db.authenticate();
            console.log('Base de Datos esta online');

        } catch(error) {
            throw new Error (error);
        }
    }

    middlewares(){

        //CORS
        this.app.use( cors() );

        //Lectura y parseo del body
        this.app.use( express.json());

    }

    routes(){ 

        this.app.use(this.personajesPath,      require('../routes/personajesRoutes'));
        this.app.use(this.peliculasPath,       require('../routes/peliculasRoutes'));
        this.app.use( this.usuariosRoutesPath, require('../routes/usuariosRoutes'));
        
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log("Servidor corriendo en puerto", this.port);
        });
    }

}


module.exports = Server;
