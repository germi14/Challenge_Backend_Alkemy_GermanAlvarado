// Modelo de los personajes que componen el mundo de Disney

module.exports = (sequelize,type) => {
    return sequelize.define('personaje',{
        id:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre:{
            type:type.STRING,
            allowNull: false,
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
        edad:{
            type:type.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                isInt: true,
            }
        },
        peso:{
            type:type.DOUBLE,
            allowNull: false,
        },
        historia:{
            type:type.STRING,
            allowNull: false,
            validate: {
              notEmpty: true,
            }
          }
    });
}