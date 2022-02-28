//Controlador para la ruta Personajes

const { response, request } = require('express'); 

const { Personaje, Pelicula, Genero } = require('../db/connection');


const listadoPersonajes = async (req = request, res= response) => {
    
    const { name = '', age = 0, movies='', weight='', ...resto } = req.query;

    if(Object.keys(resto).length!==0){
        return res.status(404).json(`El parametro de busqueda introducido ${Object.keys(resto)} no es valido, debe introducir un parametro entre las opciones: 'name', 'age', 'movies' o 'weight`);
    }

    // Listado de todos los Personajes 
    if(name==='' && age === 0 && movies==='' && weight===''){

        const personajes =await Personaje.findAll({
            attributes: ['nombre', 'imagen']
        });

        if(!personajes){
            return res.status(404).json({ error: 'Personajes no encontrados' });
        }
        let total = 0;

        personajes.forEach( () => {total+=1;});

        return res.json( { total, personajes } );

    } else{
        
        try {
            // Busqueda de Personajes por Nombre
            if (name) {

                const personajePorNombre = await Personaje.findAll({
                    where: { nombre:name },
                    attributes: ['nombre', 'imagen', 'edad', 'peso', 'historia'],
                    include: [
                        {   model: Pelicula,
                            through: { attributes: [] },
                            attributes: ['titulo', 'imagen', 'fechaCreacion'],
                            include: [
                                { model: Genero, attributes: ['nombre'] }
                            ],
                        },
                    ]
                });
                if (personajePorNombre.length===0) {
                    return res.status(404).json({ error: `Personaje no encontrado con el nombre introducido ${name}` });
                } else {
                return res.json(personajePorNombre);
                }
            }
            else if (age) {
                // Busqueda de Personajes por Edad
                const personajePorEdad = await Personaje.findAll({
                    where: { edad:age },
                    attributes: ['nombre', 'imagen', 'edad', 'peso', 'historia'],
                    include: [
                        {   model: Pelicula,
                            through: { attributes: [] },
                            attributes: ['titulo', 'imagen', 'fechaCreacion'],
                            include: [
                                { model: Genero, attributes: ['nombre'] }
                            ],
                        },
                    ]
                });
                if (personajePorEdad.length===0) {
                    return res.status(404).json({ error: 'Personaje no encontrado con la edad introducida' });
                }
                return res.status(200).json(personajePorEdad);
            }
            else if (movies) {
                // Busqueda de Personajes por Id de pelicula asociada
                const pelicula = await Pelicula.findOne( {
                    where: {id: movies},
                    attributes: ['titulo', 'imagen', 'fechaCreacion', 'calificacion'],
                    include: [
                        { model: Genero, attributes: ['nombre'] }, 
                        { model: Personaje,
                          attributes: ['nombre', 'imagen'],
                          through: { attributes: [] } 
                        }
                    ]
                });
                if (!pelicula) {
                    return res.status(404).json({ error: `El id ${movies} no pertenece a una pelicula existente en la base de datos` });
                }

                return res.status(200).json(pelicula);
            }
            else if (weight) {
                // Busqueda de Persoanjes por Peso
                const personajePorPeso = await Personaje.findAll({
                    where: { peso: weight },
                    attributes: ['nombre', 'imagen', 'edad', 'peso', 'historia'],
                    include: [
                        {   model: Pelicula,
                            through: { attributes: [] },
                            attributes: ['titulo', 'imagen', 'fechaCreacion'],
                            include: [
                                { model: Genero, attributes: ['nombre'] }
                            ],
                        }
                    ]
                });
                if (personajePorPeso.length===0) {
                    return res.status(404).json({ error: `Personaje no encontrado con el peso introducido ${weight}` });
                } else {
                    return res.json(personajePorPeso);
                }
            }

        } catch (error) {
            return res.status(500).json( { msg:'Hable con el administrador'} );
        }
    }
}

//  DETALLE DE PERSONAJE POR ID //
const detallePersonaje = async (req = request, res= response) => {
    
    const {id} = req.params;
        try {
            const personaje = await Personaje.findOne( {
                where: {id},
                attributes: ['nombre', 'imagen', 'edad', 'peso', 'historia'],
                include: [
                    {   model: Pelicula,
                        through: { attributes: [] },
                        attributes: ['titulo', 'imagen', 'fechaCreacion'],
                        include: [
                            { model: Genero, attributes: ['nombre'] }
                        ],
                    },
                ],
            });
            res.json( personaje );

        } catch (error) {
            return res.status(500).json( { msg:'Hable con el administrador' } );
        }
}

// CREAR PERSONAJE //
const crearPersonaje = async (req=request, res= response)=> {

    const {pelicula, ...body} =  req.body;

    try {
        const peliculaDB = await Pelicula.findOne({ where: { titulo:pelicula } });

        const personajeDB = await Personaje.findOne({
            where: { nombre: body.nombre},
            attributes: ['id', 'nombre', 'imagen', 'edad', 'peso', 'historia'],
        });


        if(personajeDB){
            await personajeDB.addPelicula(peliculaDB);
            return res.status(400).json(
                { msg: `El personaje ${personajeDB.nombre} ya existe, por lo que no puede crearse nuevamente, por otro lado la Pelicula ${peliculaDB.titulo} fue añadida a la lista de peliculas o series asociadas a este personaje`
                }
            );
        }

        //Generar la data que se creara

        const data = {  
            id: body.id,
            nombre: body.nombre.toUpperCase(),
            imagen: body.imagen,
            edad: body.edad,
            peso: body.peso,
            historia: body.historia
        }

        const personaje = await Personaje.create(data);
        await personaje.addPelicula(peliculaDB);

        const nuevoPersonaje = await Personaje.findOne({
            where: { id: personaje.id },
            attributes: ['nombre', 'imagen', 'edad', 'peso', 'historia'],
            include: [
                {   model: Pelicula,
                    through: { attributes: [] },
                    attributes: ['titulo', 'imagen', 'fechaCreacion'],
                    include: [
                        { model: Genero, attributes: ['nombre'] }
                    ]
                },
            ],

        });
        res.status(201).json(nuevoPersonaje);

    } catch (error) {
        return res.status(500).json( { msg:'Hable con el administrador' } );
    }
}


 // ACTUALIZAR PERSONAJE //
const actualizarPersonaje = async(req=request, res= response) =>{
    
    const {id} = req.params;
    const {...body} = req.body;
    const titulo = body.pelicula;

    try {

        const personaje= await Personaje.findOne({ where: { id } });

        if(titulo){
            const buscarPelicula = await Pelicula.findOne({
                where: { titulo }
            });

            if(!buscarPelicula){
                return res.status(400).json(
                    {msg: `La pelicula ${titulo} no existe, si desea agregar una pelicula a este personaje debe agregar una pelicula que exista`
                    }
                );
            }

            await personaje.addPelicula(buscarPelicula);
        }

        //Generar la data que se actualizara
        const data = {  
            id,
            nombre: body.nombre ? body.nombre.toUpperCase() : personaje.nombre.toUpperCase(),
            imagen: body.imagen,
            edad: body.edad,
            peso: body.peso,
            historia: body.historia
        }

        await personaje.update(data);

        const personajeActualizado = await Personaje.findOne({
            where: { id },
            attributes: ['nombre', 'imagen', 'edad', 'peso', 'historia'],
            include: [
                {   model: Pelicula,
                    through: { attributes: [] },
                    attributes: ['titulo', 'imagen', 'fechaCreacion'],
                    include: [
                        { model: Genero, attributes: ['nombre'] }
                    ]
                },
            ],
        });
        res.json(personajeActualizado);

    } catch (error) {
        return res.status(500).json( { msg:'Hable con el administrador' } );
    }
}


// BORRAR PERSONAJE //
const borrarPersonaje = async (req = request, res= response) =>{

    const {id} = req.params;
    
    try {
        const personajeBorrado = await Personaje.findOne({
            where: { id }
        });

        const personaje = await Personaje.findOne({
            where: { id },
            attributes: ['nombre', 'imagen', 'edad', 'peso', 'historia'],
            include: [
                {   model: Pelicula,
                    through: { attributes: [] },
                    attributes: ['titulo', 'imagen', 'fechaCreacion'],
                    include: [
                        { model: Genero, attributes: ['nombre'] }
                    ]
                },
            ],
        });
    
        await personajeBorrado.destroy({ truncate : true, cascade: true });

        res.json( { 'El personaje borrado fue': personaje } );

    } catch (error) {
        return res.status(500).json( { msg:'Hable con el administrador' } );
    }
}


module.exports = {
    crearPersonaje,
    listadoPersonajes,
    detallePersonaje,
    actualizarPersonaje,
    borrarPersonaje
}