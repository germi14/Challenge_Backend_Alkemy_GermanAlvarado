// Esta Ruta es para obtener, crear, actualizar y borrar peliculas

const { Router } = require('express');
const { check }  = require('express-validator'); 

const  validarCampos   = require('../middlewares/validar-campos');
const { validarJWT }   = require('../middlewares/validar-jwt');
const { generoValido } = require('../middlewares/validar-genero');

const { existePeliculaPorId, peliculaExiste, fechaValida} = require('../helpers/db-validators');

const { listadoPeliculas, detallePelicula, crearPelicula, actualizarPelicula, borrarPelicula } = require('../controllers/peliculasControler');



const router = Router();

// LISTADO DE TODOS LAS PELICULAS o BUSQUEDA DE PELICULAS POR NOMBRE, GENERO u ORDEN ASCENDENTE O DESCENDENTE
router.get('/', validarJWT, listadoPeliculas );

// DETALLE DE PELICULA POR ID
router.get('/:id',[
    validarJWT,
    check('id', 'Debe incluir un id valido').isInt(),
    check('id').custom( existePeliculaPorId),
    validarCampos
], detallePelicula );

// CREAR PELICULA
router.post('/', [
    validarJWT,
    check('titulo', 'El titulo es obligatorio').not().isEmpty(),
    check('titulo').custom( (titulo) => peliculaExiste(titulo) ),
    check('imagen', 'La imagen es obligatoria').not().isEmpty(),
    check('calificacion', 'La calificacion es obligatoria').not().isEmpty(),
    check('fechaCreacion', 'La fecha de creacion es obligatoria').not().isEmpty(),
    check('fechaCreacion').custom( (fechaCreacion) => fechaValida(fechaCreacion) ),
    check('genero', 'El genero es obligatorio').not().isEmpty(),
    generoValido,
    validarCampos
], crearPelicula);

// ACTUALIZAR PELICULA
router.put('/:id',[
    validarJWT,
    check('id', 'Debe incluir un id valido').isInt(),
    check('id').custom( existePeliculaPorId),
    generoValido,
    check('titulo').custom( (titulo) => peliculaExiste(titulo) ),
    check('fechaCreacion').custom( (fechaCreacion) => fechaValida(fechaCreacion) ),
    validarCampos
], actualizarPelicula );

// BORRAR PELICULA
router.delete('/:id',[
    validarJWT,
    check('id', 'Debe incluir un id valido').isInt(),
    check('id').custom( existePeliculaPorId),
    validarCampos
] ,borrarPelicula );


module.exports = router