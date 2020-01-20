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

router.get('/marcados', (req, res) =>{
    Paciente_Exame.find((err, docs) => {
        if(!err){
            console.log(docs)
            res.render("index/listarMarcados.hbs", {
                list: docs
            });
        }
        else{
            console.log('Erro ao recuperar lista de marcações:' + err);
        }
    })
})

router.post('/paciente/marcar', (req, res) => {
    console.log(req.body);
    var paciente_exame = new Paciente_Exame();
    paciente_exame._idPaciente = req.body._idPaciente;
    paciente_exame._idExame = req.body._idExame;
    paciente_exame.dataExame = req.body.dataExame;    
    paciente_exame.save((err, doc) => {
        if(!err){            
            res.json(paciente_exame)
            
        }   
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

function handleValidationError(err, body){   
    for(field in err.errors){
        switch(err.errors[field].path) {
            case 'nome':
                body['_idPacienteError'] = err.errors[field].message;
                break;                
            case 'telefone':
                body['_idExameError'] = err.errors[field].message;
                break;            
            case 'telefone':
                body['dataExameError'] = err.errors[field].message;
                break;            
            default:
                break;
        }
    }
}

module.exports = router;