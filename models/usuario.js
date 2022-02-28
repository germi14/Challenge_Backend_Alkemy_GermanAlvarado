
module.exports = (sequelize,type) => {
    return sequelize.define('usuario',{
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: type.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        correo:  {
            type: type.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            }
        },
        password:  {
            type: type.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
    });
}