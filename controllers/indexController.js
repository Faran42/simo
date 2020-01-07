const express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Paciente = mongoose.model('Paciente');

router.get('/paciente/:nome', (req, res) => {
    var q = Paciente.find({nome : new RegExp(req.params.nome, 'i')}).limit(8);
    q.exec(function(err, paciente) {
        res.json(paciente);
    });
});

module.exports = router;