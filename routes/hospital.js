const express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

var Hospital = require('../models/hospital');
var Usuario = require('../models/usuario');

//Rutas

// ===============================================
// Obtener todos los hospitales
// ===============================================


app.get('/', (req, res, next) => {

    Hospital.find({}, 'nombre usuario')
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospitales',
                        erros: err
                    });
                }

                res.status(400).json({
                    ok: true,
                    hospitales
                });
            });
});


// app.get('/', (req, res, next) => {

//     Hospital.find({}, function(err, hospitales) {
//         Usuario.populate(hospitales, { path: 'usuario' }, function(err, hospitales) {

//             if (err) {
//                 return res.status(500).json({
//                     ok: false,
//                     mensaje: 'Error cargando hospitales',
//                     erros: err
//                 });
//             }

//             res.status(400).json({
//                 ok: true,
//                 hospitales
//             })
//         })
//     })
// });

// ===============================================
// Actualizar hospitales
// ===============================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {



        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                erros: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id' + id + 'no existe',
                erros: { message: 'No existe un hospital con ese id' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    erros: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });
    });
});


// ===============================================
// Crear nuevos hospitales
// ===============================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                erros: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    })

});


// ===============================================
// Eliminar hospitales
// ===============================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al Borrar hospital',
                erros: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id',
                erros: { message: 'No existe un hospital con ese id' }
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalBorrado
        });
    })
})

module.exports = app;