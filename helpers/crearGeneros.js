// FUNCION PARA LA CREACION DE LA TABLA GENEROS

const crearGenero = async (Genero)=>{

  try{
    const existeGenero = await Genero.findOne();

    if ( existeGenero ){
      return new Error (`El genero ya existe`)
    }

    await Genero.bulkCreate(
      [
        { nombre: 'Animacion', imagen: 'animacion.jpg' },
        { nombre: 'Fantasia', imagen: 'fantasia.jpg' },
        { nombre: 'Musical', imagen: 'musical.jpg' },
        { nombre: 'Aventura', imagen: 'Aventura.jpg' },
        { nombre: 'Acción', imagen: 'accion.jpg' },
      ]
    );

  }catch(err){
      throw err
  }

}
  
module.exports= {
  crearGenero
}