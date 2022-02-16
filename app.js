const express = require('express');
const cors = require('cors');
var app = express();

//Importaciones rutas 
//const ejemploRutas = require('./src/routers/ejemplo.routes');
const alumnoRutas = require('./src/routes/alumno.routes')
const maestroRutas = require('./src/routes/maestro.routes')
const cursoRutas = require('./src/routes/curso.routes')


//middelwares- intemerdiarios
// permite ver roles, permite codificar el texto, interpreta el codigo
app.use(express.urlencoded({extended:false}));
app.use(express.json());
// cabeceras
// la cabeceras se ponen antes de llamar las rutas
app.use(cors());

//carga de rutas localhost:3000/api/obetnerDatos, api para darle una distincion 
// entre la parte visual y funcion
app.use('/api',alumnoRutas,maestroRutas,cursoRutas );

//indica lo que va importar, para exportar multiples varibles se crea un objeto {}
module.exports = app;