//Este middelware es para obtener todos los resultados de cualquier validacion que pudo haber generado una repuesta,
//todas estas respuestas se guardan en la funcion "validationResult"

const { validationResult } = require('express-validator');

const validarCampos = (req, res, next) => { 

    const erroresValidatorPost = validationResult(req);
    if(!erroresValidatorPost.isEmpty()){
        return res.status(400).json(erroresValidatorPost);
    }

    next();

}

module.exports = validarCampos;