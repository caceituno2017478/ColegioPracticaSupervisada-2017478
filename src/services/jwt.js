///se indica que  dato se van a almacenar

const jwt_simple= require('jwt-simple')
const moment = require('moment')
const secret ='clave-secreta'

exports.crearToken= function(usuario){
    let payload={
        //sub-id del logeo
        sub:usuario._id,
        nombre:usuario.nombre,
        email:usuario.email,
        rol: usuario.rol,

        //tiempo unico
        iat:moment().unix(),
        // tiempo de expiracion
        exp: moment().day(7, 'day').unix()
    }
    return jwt_simple.encode(payload, secret);
}


