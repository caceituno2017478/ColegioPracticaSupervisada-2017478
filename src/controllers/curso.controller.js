const Cursos = require('../models/curso.model');
const Alumnos = require('../models/maestro.alumno.model');

function agregarCursos(req, res) {
    var parametros = req.body;
    var cursoModel = new Cursos();

    if(req.user.rol === "ROL_MAESTRO"){
        if (parametros.nombre && parametros.salon) {
            cursoModel.nombre = parametros.nombre;
            cursoModel.salon = parametros.salon;
            // buscar si existe un correo igual
            Cursos.find({ nombre: parametros.nombre }, (err, cursoEncontrado) => {
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                if (cursoEncontrado.length == 0) {
                    cursoModel.save((err, usuarioGuardado) => {
                        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                        if (!usuarioGuardado) return res.status(404).send({ mensaje: "Error al agregar curso" })
    
                        return res.status(200).send({ usuario: usuarioGuardado });
                    })
                } else {
                    return res.status(404).send({ mensaje: "El correo ya existe" });
                }
            })
        } else {
            return res.status(404).send({ mensaje: "Campos incompletos" })
        }
    }
}

function modificarCursos(req,res){
    var idCur = req.params.idCursos;
    var parametros = req.body;

    if(req.user.rol  === 'ROL_MAESTRO'){
        Alumnos.updateMany({"cursos.idCursoA":idCur},
        {$set: {"cursos.$.nombreCurso": parametros.nombre}},
        {"multi": true},
            (err,cursoModificado)=>{
            if(err) return res.status(500).send({mensaje: `Error,nose hapodido resolver la consulta ${err}`});
            if(cursoModificado !== null){
                Cursos.findByIdAndUpdate(idCur,parametros, {new:true },(err, usuarioActualizado) =>{
                    if(err) return res.status(500).send({mensaje: "Error,nose hapodido resolver la consulta"});
                    if(!usuarioActualizado) return res.status(404).send({mesajes: "Error, valores son nulos"});
                    return res.status(200).send({usuarios:usuarioActualizado});
                })
            }
        })

    }
}

function eliminarCursos(req,res) {
    var idCur = req.params.idCursos;

    if(req.user.rol  === 'ROL_MAESTRO'){
        Alumnos.updateMany({"cursos.idCursoA":idCur},
        {$set: {"cursos.$.nombreCurso": "default","cursos.$.idCursoA": null}},
        {"multi": true},
        (err,cursoEliminado)=>{
            console.log(cursoEliminado  )
            if(err) return res.status(500).send({mensaje: `Error,nose hapodido resolver la consulta ${err}`});
            if(cursoEliminado!==null){
                
                Cursos.findByIdAndDelete(idCur,(err, usuarioEliminado) =>{
                    if(err) return res.status(500).send({mensaje: "Error,nose hapodido resolver la consulta"});
                    if(!usuarioEliminado) return res.status(404).send({mesajes: "Error, valores son nulos"});
                    return res.status(200).send({usuarios: usuarioEliminado})
                })
            }
        })
    }
}



module.exports={
    agregarCursos,
    modificarCursos,
    eliminarCursos
}

