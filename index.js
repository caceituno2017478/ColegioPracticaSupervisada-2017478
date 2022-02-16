// coneccion de base de datos
const mongoose = require('mongoose');
//
const app = require('./app');


// conectarse a la base de datos
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/practicasupervisada-colegio", { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Se a connectado exitosamente")
}).catch(err => console.error(err));


app.listen(3000, function (req, res) {
    console.log('EL servidor esta corriedo correctamente');
})