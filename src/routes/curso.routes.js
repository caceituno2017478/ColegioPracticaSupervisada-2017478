//importaciones 
const express = require('express');
const cursoController = require('../controllers/curso.controller')

// middleware son intemediarios
const md_autenticacion = require("../middleware/autenticacion")

//rutas
const api = express.Router();

api.post('/agregarCursos',md_autenticacion.autenticacion,cursoController.agregarCursos)
api.put("/editarCursos/:idCursos",md_autenticacion.autenticacion,cursoController.modificarCursos)
api.delete("/eliminarCursos/:idCursos",md_autenticacion.autenticacion,cursoController.eliminarCursos)
module.exports = api;