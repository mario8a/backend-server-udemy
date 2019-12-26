const express = require('express');

var app = express();

//Rutas
app.get('/', (req, res, next) => {
    res.status(400).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});

module.exports = app;