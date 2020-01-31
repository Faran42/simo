const express = require('express');
var router = express.Router();
const moment = require('moment');

const mongoose = require('mongoose');

const Paciente = mongoose.model('Paciente');
const Exame = mongoose.model('Exame');
const Paciente_Exame = mongoose.model('Paciente_Exame');

router.get('/paciente/:nome', (req, res) => {
    var q = Paciente.find({nome : new RegExp(req.params.nome, 'i')}).limit(3);
    q.exec(function(err, paciente) {
        res.json(paciente);
    });
});

router.get('/exame/:nome', (req, res) => {
    var q = Exame.find({nome : new RegExp(req.params.nome, 'i')}).limit(3);
    q.exec(function(err, exame) {
        res.json(exame);
    });
});

router.get('/marcados', (req, res) =>{
    Paciente_Exame.find().populate('_idPaciente').populate('_idExame').exec((err, docs) => {
        if(!err){
            var novoDocs = docs.map((doc) => {
                
                doc.dataExameConvertido = moment.utc(doc.dataExame).format('DD/MM/Y');
                                
                return doc;
            });
            
            res.render("index/listarMarcados.hbs", {
                list: novoDocs
            });
        }
        else{
            console.log('Erro ao recuperar lista de marcações:' + err);
        }
    })
})

router.post('/paciente/marcar', (req, res) => {
    moment.locale('pt-br')

    var iExame = req.body;

    const {dataExame} = iExame
    
    Paciente_Exame.find({ _idPaciente : req.body._idPaciente, _idExame : req.body._idExame }).populate('_idExame').exec((err, obj) =>{
        

        const tamanhoVetor = obj.length      

        // se a busca não encontrar um exame prévio, o cadastro é realizado
        if(obj[0]==null){

            console.log("Cadastro realizado às ",moment().format('LTS') )
            handleExameCreation(iExame,res);

            
        //caso um exame anterior seja encontrado para este paciente
        //sera feita uma validação para garantir que esse paciente pode
        // realizar um novo exame dependendo se o anterior ainda está válido    
        }else{
            const dataDoUltimoExame = obj[tamanhoVetor-1].dataExame
            console.log('Data do ultimo Exame',dataDoUltimoExame)
             
            
            Exame.findById(req.body._idExame).exec((err, obj) => {
                const {validade} = obj
                
                console.log('Data: ', validade, dataExame, moment.utc(dataDoUltimoExame).format('YYYY/MM/DD'), moment(dataDoUltimoExame).add(validade, 'days').calendar())
                                                
                const dataValida = moment.utc(dataDoUltimoExame).add(validade, 'days').format('YYYY-MM-DD')
                
                //
                console.log('DataExame: ', dataExame)
                console.log('Proxima data válida: ',dataValida)
               
                if(dataExame > dataValida){
                    handleExameCreation(iExame,res);
                    console.log("Cadastro realizado às ",moment().format('LTS') )
                    
                
                }else                      
                    res.status(200).send(`Paciente possui exames válido, data para o proximo exame: ${dataValida}`) 
                
            })
        }
            console.log("Repetições encontradas: ", tamanhoVetor)           
    });  
});

function handleExameCreation(iExame, res){
    
    //checar se o paciente já tem esse exame cadastrado, se não, cadastrar
    //se já tiver, checar se a validade já expirou, caso positivo cadastrar
    //caso contrário, informar que esse paciente já possui esse exame válido.

    var paciente_exame = new Paciente_Exame();
    paciente_exame._idPaciente = iExame._idPaciente;
    paciente_exame._idExame = iExame._idExame;
    paciente_exame.dataExame = iExame.dataExame;   
    
    
    paciente_exame.save((err, doc) => {
        if(!err){     
            // res.json(paciente_exame)
            res.status(200).send('Cadastro realizado com sucesso.')
        }   
        else {
            if(err.name == 'ValidationError'){
                handleValidationError(err, iExame);
                
                res.render('index.hbs',{
                    viewTitle : "Insira um novo exame",
                    paciente_exame : iExame
                });
            }                

            console.log('Error during record insertion : ' + err);
        }
    });
}

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