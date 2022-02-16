const mongoose = require('mongoose')
//schema rpopiedad de mongoose para crear las colleciones o esquemas

var Schema= mongoose.Schema;

var CursoSchema = Schema({
    nombre: String,
    salon: String
})

module.exports = mongoose.model("cursos" ,CursoSchema);
// significa que voy a exportar de este archivo