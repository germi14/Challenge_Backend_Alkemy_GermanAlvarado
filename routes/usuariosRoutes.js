// Esta Ruta es para el registro y login de Usuarios

const { Router } = require('express');
const { check }  = require('express-validator'); 

const validarCampos     = require('../middlewares/validar-campos');
const { emailExiste }   = require('../helpers/db-validators');

const { usuariosRegister, usuariosLogin } = require('../controllers/usuariosControler');


const router = Router();

//REGISTRO DE USUARIOS
router.post('/register',[ 
    check('correo','Este correo no es valido').isEmail(),
    check('correo').custom( (correo) => emailExiste(correo) ), 
    check('nombre','El Nombre es obligatorio').not().isEmpty(),
    check('password','La contrasena es obligatoria y debe ser de un minimo de 6, contener al menos una letra mayuscula, una letra minuscula, un numero y un simbolo').isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }),
    validarCampos 
], usuariosRegister);

//LOGIN DE USUARIOS
router.post('/login', [
    check('correo','El correo es obligatorio').isEmail(),
    check('password','La contrasena es obligatoria').not().isEmpty(),
    validarCampos
], usuariosLogin);


module.exports = router