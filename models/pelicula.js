// Modelo de las peliculas o series que componen el mundo de Disney

module.exports = (sequelize,type) => {
    return sequelize.define('pelicula',{
        id:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        titulo:{
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
        },
        fechaCreacion:{
            type:type.DATEONLY,
            allowNull: false,
            validate: {
                isDate: true,
            }
        },
        calificacion:{
            type:type.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                isInt: true,
            }
        }
    });
}