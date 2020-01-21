const mongoose = require('mongoose');

var paciente_exameSchema = new mongoose.Schema({
    _idPaciente: { type: mongoose.Schema.ObjectId, ref: 'Paciente' },
    _idExame: { type: mongoose.Schema.ObjectId, ref: 'Exame' },
    dataExame:{
        type: Date
    },
});

mongoose.model('Paciente_Exame', paciente_exameSchema);