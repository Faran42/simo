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
    var iExame = req.body;    


    Paciente_Exame.find({ _idPaciente : req.body._idPaciente, _idExame : req.body._idExame }).exec((err, obj) =>{
        const {_idPaciente} = obj;

        const tamanhoVetor = obj.length
        console.log(tamanhoVetor)
        if(obj[0]==null){
            console.log("Pode cadastrar")
            
            
        }else
            console.log("Repetições encontradas: ", tamanhoVetor)
            console.log(obj[tamanhoVetor-1])
            

               
        

        
    });

    handleExameCreation(iExame,res);
    /*console.log(1, iExame)
    Paciente_Exame.findOne({ _idPaciente : iExame._idPaciente, _idExame : iExame.dataExame}).populate('_idExame').exec((err, pac_exame) => {
        console.log(pac_exame.dataExame)
        if (!pac_exame){
            console.log(3, pac_exame)

            

        } else{
            var dataExame = moment(pac_exame.dataExame);
            var validade = moment(pac_exame._idExame.validade);
            var dataFinal = dataExame.add(validade, 'days');
            var queroMarcarEstaData = moment(iExame.dataExame);
            var range = moment().range(dataExame, dataFinal);
            var naoPossoMarcar = range.contains(queroMarcarEstaData);
            if (naoPossoMarcar){
                //nao posso marcar porque ja existe um exame nesta data
            }
            else {
                handleExameCreation(iExame,res);
            }
        };
    });  */  
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
            res.json(paciente_exame)
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