//importaciones 
const express = require('express');
const alumnoController = require('../controllers/alumno.controller')

// middleware son intemediarios
const md_autenticacion = require("../middleware/autenticacion")

//rutas
const api = express.Router();

api.post('/agregarAlumnos',md_autenticacion.autenticacion,alumnoController.agregarAlumnos)
api.put("/editarAlumnos/:idAlumnos",md_autenticacion.autenticacion,alumnoController.modificarAlumnos)
api.delete("/eliminarAlumnos/:idAlumnos",md_autenticacion.autenticacion,alumnoController.eliminarAlumnos)

api.post('/login',alumnoController.login)

//cursos agregar 
api.put("/agregarCursos",md_autenticacion.autenticacion,alumnoController.agregarCursos)
api.put("/editarCurso/:idCurso",md_autenticacion.autenticacion,alumnoController.editarCursos)
api.get("/listarCurso",md_autenticacion.autenticacion,alumnoController.listarCursos)
module.exports = api;