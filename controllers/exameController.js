const express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Exame = mongoose.model('Exame');

router.get('/', (req, res) => {
    res.render('exame/addOrEdit.hbs',{
        viewTitle : "Insira um novo Exame" 
    });
});

router.post('/', (req, res) => {
    if(req.body._id ==''){
        insertRecord(req, res);
    }        
    else{
        updateRecord(req, res);
    }
       
});

function insertRecord( req, res){
    var exame = new Exame();






    exame.nome = req.body.nome;
    exame.descricao = req.body.descricao;
    exame.validade = req.body.validade;    
    exame.save((err, doc) => {
        if(!err)
            res.redirect('exame/list')
        else {
            if(err.name == 'ValidationError'){
                handleValidationError(err, req.body);
                res.render('exame/addOrEdit.hbs',{
                    viewTitle : "Insira um novo exame",
                    exame : req.body
                });
            }
                

            console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res){
    Exame.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, doc) => {
        if(!err){
            res.redirect('Exame/list');
        }
        else{
            if(err.nome == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("User/addOrEdit", {
                    viewTitle: 'Atualizar Exame',
                    Exame: req.body
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
    Exame.find((err, docs) => {
        if(!err){
            res.render("exame/list.hbs", {
                list: docs
            });
        }
        else{
            console.log('Error in retrieving employee list:' + err);
        }
    });
});

function handleValidationError(err, body){   
    for(field in err.errors){
        switch(err.errors[field].path) {
            case 'nome':
                body['nomeError'] = err.errors[field].message;
                break; 
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Exame.findById(req.params.id, (err, doc) => {
        if(!err){
            res.render("exame/addorEdit.hbs", {
                viewTitle: "Atualizar Exame",
                exame: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Exame.findByIdAndRemove(req.params.id, (err, docs) => {
        if(!err){
            res.redirect('/exame/list');
        }
        else{
            console.log('Error in user delete: ' + err);
        }
    });
});

module.exports = router;
