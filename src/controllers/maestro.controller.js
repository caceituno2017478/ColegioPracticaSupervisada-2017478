const Maestros = require('../models/maestro.alumno.model');
const bcrypt =require("bcrypt-nodejs");
const jwt= require("../services/jwt");


function agregarMaestros(req, res) {
    var maestroModel = new Maestros();
    maestroModel.gmail = "maestro";
    maestroModel.rol = "ROL_MAESTRO";
    Maestros.find({email: maestroModel.email},(err,emailEncontrado)=>{
        if(err) return res.status(500).send({mensaje: "Error en la peticion"});
        if(emailEncontrado.length==0){
            bcrypt.hash("123456",null, null,(err, passwordEncrypter) => {
                maestroModel.password = passwordEncrypter;
                maestroModel.save((err,usuarioGuardado)=>{
                    if(err) return res.status(500).send({mensaje: "Error en la peticion"});
                    if(!usuarioGuardado) return res.status(404).send({mensaje: "Error al agregar usuario"})
            
                    return  res.status(200).send({usuario:usuarioGuardado});
                })
            })
        }else{
            return res.status(404).send({mensaje: "El correo ya existe"});
        }
    })
}

module.exports ={
    agregarMaestros
}
    
