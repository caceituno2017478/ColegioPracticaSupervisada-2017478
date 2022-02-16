var http = require('http'); // el var pude ser llamado publicamente; es decir, public
// require('http'): require si para poder acceder aun archivo, el http es el archivo. 
//solo se colo al nombre del archivo no ruta.

// let http = require('http'); este solo se pude llamar privadamente; es decir, private

http.createServer(function(req, res){
    res.writeHeader(200, {"Content-Type": "text/html"});
    res.end("Hola mundo");
}).listen(80);

// req recive datos. res envia datos
// listen significa escuhe

console.log("todo esta corriendo de maravilla");