const Alumnos = require('../models/maestro.alumno.model');
const Cursos = require('../models/curso.model');
const bcrypt =require("bcrypt-nodejs");
const jwt= require("../services/jwt");

function agregarAlumnos(req, res){
    var parametros = req.body;
    var alumnoModelo = new Alumnos();
        if(parametros.nombre&&parametros.apellido&& parametros.gmail&&parametros.password){
            alumnoModelo.nombre = parametros.nombre;
            alumnoModelo.apellido = parametros.apellido;
            alumnoModelo.gmail = parametros.gmail;
            alumnoModelo.rol = "ROL_ALUMNO";
    
            // buscar si existe un correo igual
            Alumnos.find({gmail: parametros.gmail},(err,gmailEncontrado)=>{
                if(err) return res.status(500).send({mensaje: "Error en la peticion"});
                if(gmailEncontrado.length==0){
                    bcrypt.hash(parametros.password,null,null, (err,contrasenaEncriptada)=>{
                        alumnoModelo.password = contrasenaEncriptada;
    
                        alumnoModelo.save((err,usuarioGuardado)=>{
                            if(err) return res.status(500).send({mensaje: "Error en la peticion"});
                            if(!usuarioGuardado) return res.status(404).send({mensaje: "Error al agregar usuario alumno"})
                    
                            return  res.status(200).send({usuario:usuarioGuardado});
                        })
                    });
                }else{
                    return res.status(404).send({mensaje: "El correo ya existe"});
                }
            })  
        }else{
            return res.status(404).send({mensaje: "Campos incompletos"})
        }
    
}

function modificarAlumnos(req,res){
    var idAlum = req.params.idAlumnos;
    var parametros = req.body;

    if(req.user.rol  === 'ROL_ALUMNO'){
        Alumnos.findByIdAndUpdate(idAlum,parametros, {new:true },(err, usuarioActualizado) =>{
            if(err) return res.status(500).send({mensaje: "Error,nose hapodido resolver la consulta"});
            if(!usuarioActualizado) return rs.status(404).send({mesajes: "Error, valores son nulos"});
            return res.status(200).send({usuarios:usuarioActualizado});
        })
    }else{
        return res.status(404).send({mensaje: "No tienes los permisos necesarios"})
    }
}

function eliminarAlumnos(req,res) {
    var idAlum = req.params.idAlumnos;
    Alumnos.findByIdAndDelete(idAlum,(err, usuarioEliminado) =>{
        if(err) return res.status(500).send({mensaje: "Error,nose hapodido resolver la consulta"});
        if(!usuarioEliminado) return rs.status(404).send({mesajes: "Error, valores son nulos"});
        return res.status(200).send({usuarios: usuarioEliminado})
    })
}

function login(req,res){
    var parametros= req.body;
    // findone regresa un objeto
    //find regresa un array
    Alumnos.findOne({gmail: parametros.gmail},(err,usuarioEncontrado)=>{
        if(err) return res.status(500).send({mensaje: "Error,nose apodido resolver la consulta"});
        if(usuarioEncontrado){     
            //comparo contrasena                                               // retorna un true o false
            bcrypt.compare(parametros.password,usuarioEncontrado.password,(err,verificacionContrasena)=>{
                // se compara si las contraseñas coinciden
                if(verificacionContrasena){

                    // postman todo lo envia como texto, ahora si se especifica cambia en postman
                    if(parametros.obtenerToken === 'true'){
                        return res.status(200).send({
                            token: jwt.crearToken(usuarioEncontrado)
                        })
                    }else{
                        usuarioEncontrado.password= undefined;
                        return res.status(200).send({usuario: usuarioEncontrado})
                    }

                }else{
                    return res.status(500).send({mensaje: "La contraseña es incorrecta"}) 
                }
            })
        }else{
            return res.status(500).send({mensaje: "el usuario no se ha podido identificar"})
        }
    })
}

function agregarCursos(req, res) { 
    if(req.user.rol === "ROL_ALUMNO"){
        var parametros = req.body;
        var revision = false;
        Cursos.findOne({nombre: parametros.nombreCurso},(err, cursoEncontrado) => {
            if(err) return res.status(500).send({mensaje: `Error en la peticion ${err}`})
            if(cursoEncontrado !== null){
            Alumnos.findById(req.user.sub,(err,verficacionLogitud)=>{
                if(err) return res.status(500).send({mensaje: "Error en la peticion"})
                console.log(verficacionLogitud.cursos.length)
                if(verficacionLogitud.cursos.length <= 2){
                    var arrayCursos = {};
                    arrayCursos = verficacionLogitud.cursos;
                    arrayCursos.forEach(element => {
                        if(element.nombreCurso=== parametros.nombreCurso){
                            revision = true;
                            return res.status(404).send({mensaje: "Ya se asignado a ese curso"})
                            
                        }
                    });

                    if(revision === false){
                        Alumnos.findByIdAndUpdate(req.user.sub, { $push: { cursos: {nombreCurso: cursoEncontrado.nombre,
                            idCursoA: cursoEncontrado.id} } },{new: true},(err,repuestaAgregada) => {
                                if(err) return res.status(500).send({mensaje: "Error en la peticion"})
                                if(!repuestaAgregada) return res.status(404).send({mensaje: "Error al agregar la encuesta"})
                                return res.status(200).send({encuesta: repuestaAgregada})
                        })
                    }
                    
                }else{
                    return res.status(404).send({mensaje: "Te has asignado al maximo de cursos"})
                } 
            })
            }else{
                return res.status(200).send({mensaje: "El curso no existe"})
            }
        }) 
    }else{
        return res.status(404).send({mensaje: "No tienes los permisos necesarios"})
    }
}


function editarCursos(req,res){
    if(req.user.rol === "ROL_ALUMNO"){
        var idCur = req.params.idCurso;
        var parametros = req.body;
        Alumnos.findOne({"cursos._id": idCur},(err,cursoEncontrado) =>{
            console.log(cursoEncontrado)
            console.log(cursoEncontrado.cursos.nombreCurso)
            console.log(cursoEncontrado.cursos._id)
            if(err) return res.status(500).send({mensaje:`Error en la peticion ${err}`})
            Alumnos.findOneAndUpdate({cursos: {$elemMatch: {_id: idCur, idCursoA: cursoEncontrado.id }}},
                {"cursos.$.nombreCurso": parametros.nombreCurso}
                ,{new: true},(err, respuestaEditada) => {
                console.log(respuestaEditada)
                if(err) return res.status(500).send({mensaje: `error en la peticion ${err}`})
                if(!respuestaEditada) return res.status(404).send({mensaje: `No se a podido cambiar de curso ${respuestaEditada}`}) 
                return res.status(200).send({curso: respuestaEditada})
        
            })
            
        })
    }else{
        return res.status(404).send({mensaje: "No tienes los permisos necesarios"})
    }
}

function listarCursos(req, res) {
    Alumnos.findById(req.user.sub,(err, cursosAsignados) => {
        if(err) return res.status(500).send({mensaje: `error en la peticion ${err}`})
        if(!cursosAsignados) return res.status(404).send({mensaje: `No se a podido cambiar de curso ${cursosAsignados}`}) 
        return res.status(200).send({curso: cursosAsignados.cursos})
    })
}

module.exports ={
    agregarAlumnos,
    modificarAlumnos,
    eliminarAlumnos,
    login,
    agregarCursos,
    editarCursos,
    listarCursos
}