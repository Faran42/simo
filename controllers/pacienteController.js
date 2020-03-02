const express = require('express');
var router = express.Router();
const moment = require('moment');

const mongoose = require('mongoose');
const Paciente = mongoose.model('Paciente');

router.get('/', (req, res) => {
    res.render('paciente/addOrEdit.hbs',{
        viewTitle : "Insira um novo paciente" 
    });
});

router.post('/', (req, res) => {
    if(req.body._id ===''){
        
        insertRecord(req, res);
    }   

    else{
        console.log('update');
        updateRecord(req, res);
    }
       
});

async function insertRecord( req, res){

    

    const pacienteExiste = await Paciente.findOne({ cartaoSus: req.body.cartaoSus })

    if(!pacienteExiste){

        var paciente = new Paciente();

        paciente.nome = req.body.nome;
        paciente.sobreNome = req.body.sobreNome;
        paciente.dataNascimento = req.body.dataNascimento;
        paciente.sexo = req.body.sexo;
        paciente.cartaoSus = req.body.cartaoSus;
        paciente.endereco = req.body.endereco;
        paciente.numero = req.body.numero;
        paciente.complemento = req.body.complemento;
        paciente.bairro = req.body.bairro;
        paciente.cidade = req.body.cidade;
        paciente.estado = req.body.estado;
        paciente.cep = req.body.cep;
        paciente.telefone = req.body.telefone;

        paciente.save((err, doc) => {
            if (!err)
                res.redirect('paciente/list')
            else {
                if(err.name == 'ValidationError'){
                    handleValidationError(err, req.body);
                    res.render('paciente/addOrEdit.hbs',{
                        viewTitle : "Insira um novo paciente",
                        paciente : req.body

                    });
                }                    
    
                console.log('Error during record insertion : ' + err);
            }
        });
    }

    else{
        return res.render('paciente/addOrEdit.hbs',{
            viewTitle : "Insira um novo paciente",
            paciente : req.body,
            response: "Erro! Usuário já existe na base de dados."
       })
    }   
}

function updateRecord(req, res){
    Paciente.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, doc) => {    
        if(!err){    
            res.redirect('paciente/list');
        }
        else{
            if(err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("paciente/addOrEdit", {
                    
                    viewTitle: 'Atualizar Paciente',
                    
                    
                    paciente: req.body
                    
                });
            }
            else{
                console.log('Error during record update: ' + err);
            }            
        }
    });
};

router.get('/list', (req, res) => {
    // res.json('from list');
    Paciente.find((err, docs) => {        
        if(!err){
            res.render("paciente/list.hbs", {
                list: docs
            });
        }
        else{
            console.log('Error in retrieving paciente list:' + err);
        }
    });
});

function handleValidationError(err, body){   
    for(field in err.errors){
        switch(err.errors[field].path) {
            case 'nome':
                body['nomeError'] = err.errors[field].message;
                break;
            case 'sobrenome':
                body['sobrenomeError'] = err.errors[field].message;
                break;
            case 'dataNascimento':
                body['dataNascimentoError'] = err.errors[field].message;
                break;
            case 'sexo':
                body['sexoError'] = err.errors[field].message;
                break;
            case 'cartaoSus':
                body['cartaoSusError'] = err.errors[field].message;
                break;
            case 'endereco':
                body['enderecoError'] = err.errors[field].message;
                break;
            case 'numero':
                body['complementoError'] = err.errors[field].message;
                break;
            case 'complemento':
                body['emailError'] = err.errors[field].message;
                break;
            case 'bairro':
                body['bairroError'] = err.errors[field].message;
                break;
            case 'cidade':
                body['cidadeError'] = err.errors[field].message;
                break;
            case 'estado':
                body['estadoError'] = err.errors[field].message;
                break;
            case 'cep':
                body['cepError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            case 'telefone':
                body['telefoneError'] = err.errors[field].message;
                break;            
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Paciente.findById(req.params.id, (err, doc) => {
        
        doc.dataNascimentoConvertida = moment.utc(doc.dataNascimento).format('YYYY-MM-DD');
        
        if(!err){
            res.render("paciente/addorEdit.hbs", {
                viewTitle: "Atualizar Paciente",                 
                paciente: doc,
                dnc: doc.dataNascimentoConvertida
            });
        }

        console.log({doc})
    });
});

router.get('/delete/:id', (req, res) => {
    Paciente.findByIdAndRemove(req.params.id, (err, docs) => {
    // Paciente.findOneAndDelete(req.params.id, (err, docs) => {
        if(!err){
            res.redirect('/paciente/list');
        }
        else{
            console.log('Error in user delete: ' + err);
        }
    });
});

module.exports = router;