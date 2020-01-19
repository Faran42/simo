const express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

const Paciente = mongoose.model('Paciente');
const Exame = mongoose.model('Exame');
const Paciente_Exame = mongoose.model('Paciente_Exame');

router.get('/paciente/:nome', (req, res) => {
    var q = Paciente.find({nome : new RegExp(req.params.nome, 'i')}).limit(8);
    q.exec(function(err, paciente) {
        res.json(paciente);
    });
});

router.get('/exame/:nome', (req, res) => {
    var q = Exame.find({nome : new RegExp(req.params.nome, 'i')}).limit(8);
    q.exec(function(err, exame) {
        res.json(exame);
    });
});

router.post('/paciente/marcar', (req, res) => {
    console.log(req.body);
    var paciente_exame = new Paciente_Exame();
    paciente_exame._idPaciente = req.body._idPaciente;
    paciente_exame._idExame = req.body._idExame;
    paciente_exame.data = req.body.data;    
    paciente_exame.save((err, doc) => {
        if(!err)
            // res.redirect('/')
            res.json(paciente_exame)
        else {
            if(err.name == 'ValidationError'){
                handleValidationError(err, req.body);
                res.render('index.hbs',{
                    viewTitle : "Insira um novo exame",
                    paciente_exame : req.body
                });
            }                

            console.log('Error during record insertion : ' + err);
        }
    });
});

module.exports = router;