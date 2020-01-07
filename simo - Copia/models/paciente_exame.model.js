const mongoose = require('mongoose');

var paciente_exameSchema = new mongoose.Schema({
    _idPaciente:{
        type: String
    },
    _idExame:{
        type: String
    }
});

mongoose.model('Paciente_Exame', paciente_exameSchema);