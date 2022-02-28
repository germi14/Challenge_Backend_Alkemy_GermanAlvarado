// Modelo de la tabla de Generos, a los cuales pertenecen las peliculas o series que componen el mundo de Disney

module.exports = (sequelize,type) => {
    return sequelize.define('genero', {
        id:{
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre:{
            type:type.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            }
        },
        imagen:{
            type:type.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        }
    });
}