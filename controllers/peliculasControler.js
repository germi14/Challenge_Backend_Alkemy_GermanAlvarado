//Controlador para la ruta Peliculas o series

const { response, request } = require('express'); 

const { Pelicula, Genero, Personaje } = require('../db/connection');


const listadoPeliculas = async (req = request, res= response) => {
    
    const { name = '', genre = '', order='', ...resto } = req.query;

    if(Object.keys(resto).length!==0){
        return res.status(404).json(`El parametro de busqueda introducido ${Object.keys(resto)} no es valido, debe introducir un parametro entre las opciones: 'name', 'genre' o 'order`);
    }

    // Listado de todas las Peliculas 
    if(name==='' && genre === '' && order===''){

        const peliculas =await Pelicula.findAll({
            attributes: ['titulo', 'imagen', 'fechaCreacion']
        });

        if(!peliculas){
            return res.status(404).json({ error: 'Pelicula no encontrada' });
        }
        let total = 0;

        peliculas.forEach( () => {total+=1} );

        return res.json( { total, peliculas } );

    } else{

        try {
            // Busqueda de Peliculas por Nombre
            if (name) {

                const peliculaPorNombre = await Pelicula.findOne({
                    where: { titulo: name },
                    attributes: ['titulo', 'imagen', 'fechaCreacion', 'calificacion'],
                    include: [
                        { model: Genero, attributes: ['nombre'] },
                        { model: Personaje,
                          attributes: ['nombre', 'imagen', 'historia'],
                          through: { attributes: [] }
                        }
                    ],
                });

                if (!peliculaPorNombre) {
                    return res.status(404).json({ error: `Pelicula no encontrada con el nombre ${name}` });
                }

                return res.status(201).json(peliculaPorNombre);
            }
            else if (order) {
                // Busqueda de Peliculas por Orden Ascendete o Descendente
                if (order.toUpperCase()!== 'ASC' && order.toUpperCase()!=='DESC') {
                    return res.status(500).json({ error: `El orden ${order} es erroneo, debe introducir 'ASC' o 'DESC' como valor` });
                }

                const peliculaPorOrden = await Pelicula.findAll({
                    order: [['fechaCreacion', order]],
                    attributes: ['titulo', 'imagen', 'fechaCreacion', 'calificacion'],
                    include: [
                        { model: Genero, attributes: ['nombre'] },
                        { model: Personaje,
                        attributes: ['nombre', 'imagen'],
                        through: { attributes: [] },
                        }
                    ]
                });

                return res.status(200).json(peliculaPorOrden);
            }
            else if (genre) {
                // Busqueda de Peliculas por Genero
                const peliculaPorGenero = await Pelicula.findAll({
                    where: { generoId:genre },
                    attributes: ['titulo', 'imagen', 'fechaCreacion', 'calificacion'],
                    include: [
                        { model: Genero, attributes: ['nombre'] },
                        { model: Personaje,
                        attributes: ['nombre', 'imagen'],
                        through: { attributes: [] },
                        }
                    ],
                });

                if (peliculaPorGenero.length===0) {
                    return res.status(404).json({ error: 'Pelicula no encontrada con el Idgenero introducido' });
                }

                return res.status(200).json(peliculaPorGenero);
            }

        } catch (error) {
            return res.status(500).json( { msg:'Hable con el administrador' } );
        }
    }
}

//  DETALLE DE PELICULA POR ID
const detallePelicula = async (req = request, res= response) => {
    
    const {id} = req.params;
        try {
            const pelicula = await Pelicula.findOne( {
                where: {id},
                attributes: ['titulo', 'imagen', 'fechaCreacion', 'calificacion'],
                include: [
                    { model: Genero, attributes: ['nombre'] }, 
                    { model: Personaje,
                      attributes: ['nombre', 'imagen'],
                      through: { attributes: [] } 
                    }
                ]
            });

            res.json( pelicula );
            
        } catch (error) {
            return res.status(500).json( { msg:'Hable con el administrador' } );
        }
}

// CREAR PELICULA
const crearPelicula = async (req=request, res= response)=> {

    const {genero, ...body} =  req.body;
    try {
        const buscarGenero = await Genero.findOne({
            where: { nombre: genero },
            attributes: ['nombre','id'],
        });


        //Generar la data que se creara
        const data = {  
            id: body.id,
            titulo: body.titulo.toUpperCase(),
            imagen: body.imagen,
            fechaCreacion: body.fechaCreacion,
            calificacion: body.calificacion,
            generoId: buscarGenero.id
        }

        const pelicula = await Pelicula.create(data);

        const nuevaPelicula = await Pelicula.findOne({
            where: { id: pelicula.id },
            attributes: ['titulo', 'imagen', 'fechaCreacion', 'calificacion'],
            include: [{ model: Genero, attributes: ['nombre'] }],
        });
    
        res.status(201).json(nuevaPelicula);
    } catch (error) {
        return res.status(500).json( { msg:'Hable con el administrador' } );
    }
}


 // actualizar PELICULA
const actualizarPelicula = async(req=request, res= response) =>{
    
    const {id} = req.params;
    const {...body} = req.body;
    const genero = body.genero;

    try {

        const pelicula = await Pelicula.findOne({ where: { id } });
    
        let buscarGenero={};
        if(genero){
        buscarGenero = await Genero.findOne({
            where: { nombre: genero },
            attributes: ['nombre','id'],
         });
        }else {
            buscarGenero = await Genero.findOne({
                where: { id: pelicula.generoId },
                attributes: ['nombre','id'],
            });
        }

        //Generar la data que se actualizara
        const data = {  
            id: pelicula.id,
            titulo: body.titulo ? body.titulo.toUpperCase() : pelicula.titulo.toUpperCase(),
            imagen: body.imagen,
            fechaCreacion: body.fechaCreacion,
            calificacion: body.calificacion,
            generoId: buscarGenero.id
        }

        await pelicula.update(data);

        const peliculaActualizada = await Pelicula.findOne({
            where: { id },
            attributes: ['titulo', 'imagen', 'fechaCreacion', 'calificacion'],
            include: [
                { model: Genero, attributes: ['nombre'] }, 
                { model: Personaje,
                  attributes: ['nombre', 'imagen'],
                  through: { attributes: [] } 
                }
            ],
        });

        res.json(peliculaActualizada);
    } catch (error) {
        return res.status(500).json( { msg:'Hable con el administrador' } );
    }
}


// Borrar pelicula
const borrarPelicula = async (req = request, res= response) =>{

    const {id} = req.params;
    
    try {
    
        const pelicula = await Pelicula.findOne({
            where: { id },
            attributes: ['titulo', 'imagen', 'fechaCreacion', 'calificacion'],
            include: [
                { model: Genero, attributes: ['nombre'] }, 
                { model: Personaje,
                  attributes: ['nombre', 'imagen'],
                  through: { attributes: [] } 
                }
            ],
        });
        const peliculaBorrada = await Pelicula.findOne( { where: { id } } );

        await peliculaBorrada.destroy({ truncate : true, cascade: true });

        res.json( { 'La pelicula borrada fue': pelicula } );

    } catch (error) {
        return res.status(500).json( { msg:'Hable con el administrador' } );
    }
}


module.exports = {
    crearPelicula,
    listadoPeliculas,
    detallePelicula,
    actualizarPelicula,
    borrarPelicula
}