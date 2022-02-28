//Controlador para la ruta usuarios

const bcryptjs = require('bcryptjs');

const { response, request } = require('express'); 

const {Usuario} = require('../db/connection');

const { generarJWT } = require('../helpers/generarJWT');

const email = require('../helpers/sendgrid')


//Controlador para registrar usuarios
const usuariosRegister = async (req=request , res= response) => {

    const {nombre, correo, password, ...body} = req.body;

    try {
    
        const data = {
            nombre: nombre.toUpperCase(),
            correo,
            password
        }

        const usuario = new Usuario( data );

        //Ecriptar la contrasena
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync( password, salt ); 

        //Parametros del correo de bienvenida que se enviara al usuario registrado
        const msg = {
            to: correo,
            from: process.env.correoRemitente,
            subject: 'Email de Bienvenida.',
            text: 'Texto de prueba',
            html: '<stong> Texto de prueba html </strong>'
        };

        //Envio de correo de bienvenida al usuario registrado
        await email.send(msg);

        //Guardar en BD
        await usuario.save();

        const nuevoUsuario = await Usuario.findOne({
            where: { nombre },
            attributes: ['nombre', 'correo', 'password'],
        });

        res.json( nuevoUsuario );

    } catch (error) {
        res.status(500).json( { msg: 'Hable con el administrador' } )    
    }

};


//Controlador de la ruta para el login de usuarios
const usuariosLogin = async (req, res = response) => {

    const { correo, password} = req.body;

    try{
        //Verificar si el correo existe
        const usuario = await Usuario.findOne( {
            where:{correo},
            attributes: ['id','nombre', 'correo', 'password'],
        } );
        
        if(!usuario) {
            return res.status(400).json( { msg: 'El correo no es correcto' } )
        }

        //Verificar la contrasena
        const passwordValida = bcryptjs.compareSync( password, usuario.password); 
        if(!passwordValida){
            return res.status(400).json( { msg: 'La contrasena es incorrecta' } )
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id );

        //Mostrar solos los campos necesarios del usuario
        const usuarioMostrado = await Usuario.findOne( {
            where:{correo},
            attributes: ['nombre', 'correo', 'password'],
        } );
        
        res.json( { Usuario: usuarioMostrado, token } )

    }catch (error) {
        return res.status(500).json( { msg:'Hable con el administrador' } );
    }

}

module.exports = {
    usuariosRegister,
    usuariosLogin
}