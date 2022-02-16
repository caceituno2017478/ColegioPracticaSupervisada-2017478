const jwt= require('jwt-simple')
const moment = require('moment')
const secret ='clave-secreta'

//next que lea la funcion, indica que es lo siguiente que sigue y que no es la ultima funcion
exports.autenticacion = function(req,res,next){
    // con el tambine se pueden obtener las cabeceras
    if(!req.headers.authorization){
        return res.status(404).send({mensaje: " la peticion no tiene la cabecera de authorization"})
    }
    var token= req.headers.authorization.replace(/[""]+/g, '');

    try{
        // payload, son los datos almacenados en el token
        var payload = jwt.decode(token, secret);
        if(payload.exp <= moment().unix()){   
            return res.status(404).send({mensaje: 'El token ha expirado'})
        }
    }catch(error){
        return res.status(500).send({mensaje: ' el token no es valido'})
    }

    // se obtiene los datos del que esta logueo
    // tambien se esta creando una varible dentro de req llamada user
    req.user = payload;
    next();
}