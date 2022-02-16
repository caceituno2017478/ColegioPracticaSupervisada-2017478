//importaciones 
const express = require('express');
const maestroController = require('../controllers/maestro.controller')

// middleware son intemediarios
const md_autenticacion = require("../middleware/autenticacion")

//rutas
const api = express.Router();

api.get("/maestroPrincipal",maestroController.agregarMaestros)

module.exports = api;