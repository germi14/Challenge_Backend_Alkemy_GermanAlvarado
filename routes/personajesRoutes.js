// Esta Ruta es para obtener, crear, actualizar y borrar Personajes

const { Router } = require('express');
const { check }  = require('express-validator'); 

const { validarJWT } = require('../middlewares/validar-jwt');
const validarCampos  = require('../middlewares/validar-campos');

const { listadoPersonajes, crearPersonaje, detallePersonaje, actualizarPersonaje, borrarPersonaje } = require('../controllers/personajesControler');

const { existePersonajePorId, peliculaNoEncontrada } = require('../helpers/db-validators');


const router = Router();

// LISTADO DE TODOS LOS PERSONAJES o BUSQUEDA DE PERSONAJES POR NOMBRE, EDAD, PESO O PELICULA/SERIE
router.get('/', validarJWT, listadoPersonajes );

// DETALLE DE PERSONAJE POR ID
router.get('/:id',[
    validarJWT,
    check('id', 'Debe incluir un id valido').isInt(),
    check('id').custom( existePersonajePorId),
    validarCampos
], detallePersonaje );

// CREAR PERSONAJE
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre del personaje es obligatorio').not().isEmpty(),
    check('imagen', 'La imagen del personaje es obligatoria').not().isEmpty(),
    check('edad', 'La edad del personaje es obligatoria').not().isEmpty(),
    check('peso', 'El peso del personaje es obligatorio').not().isEmpty(),
    check('pelicula', 'El titulo de la pelicula o serie al cual pertenece el personaje es obligatorio').not().isEmpty(),
    check('pelicula').custom( (pelicula) => peliculaNoEncontrada(pelicula) ),
    check('historia', 'La historia del personaje es obligatoria').not().isEmpty(),
    validarCampos
], crearPersonaje);

// ACTUALIZAR PERSONAJE
router.put('/:id',[
    validarJWT,
    check('id', 'Debe incluir un id valido').isInt(),
    check('id').custom( existePersonajePorId),
    validarCampos
], actualizarPersonaje );

// BORRAR PERSONAJE
router.delete('/:id',[
    validarJWT,
    check('id', 'Debe incluir un id valido').isInt(),
    check('id').custom( existePersonajePorId),
    validarCampos
] ,borrarPersonaje );


module.exports = router