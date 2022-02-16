const mongoose = require('mongoose')
//schema rpopiedad de mongoose para crear las colleciones o esquemas

var Schema= mongoose.Schema;

var MaestrosAlumnosSchema = Schema({
    nombre: String,
    apellido: String,
    gmail: String,
    password: String,
    cursos:[{
        nombreCurso: String,
        idCursoA: {type: Schema.Types.ObjectId, ref: "cursos"}
    }],
    rol: String
})

module.exports = mongoose.model("usuarios" ,MaestrosAlumnosSchema);
// significa que voy a exportar de este archivo

