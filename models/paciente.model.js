const mongoose = require('mongoose');

var pacienteSchema = new mongoose.Schema({
    nome:{
        type: String,
        required: 'Campo obrigatório.'
    },
    sobreNome:{
        type: String,
        required: 'Campo obrigatório.'
    },
    dataNascimento:{
        type: Date,
        required: 'Campo obrigatório.'
    },
    sexo:{
        type: String,
        // required: 'Campo obrigatório.'
    },
    cartaoSus:{
        type: Number,
        required: 'Campo obrigatório.',
        unique: true
    },
    endereco:{
        type: String,
        required: 'Campo obrigatório.'
    },
    numero:{
        type: String,        
    },
    complemento:{
        type: String,        
    },
    bairro:{
        type: String,
        required: 'Campo obrigatório.'
        // required: 'Campo obrigatório.'
    },
    cidade:{
        type: String,
        required: 'Campo obrigatório.'
        // required: 'Campo obrigatório.'
    },
    estado:{
        type: String,
        required: 'Campo obrigatório.'
        // required: 'Campo obrigatório.'
    },
    cep:{
        type: String,
        required: 'Campo obrigatório.'
        // required: 'Campo obrigatório.'
    },
    email:{
        type: String,
        // required: 'Campo obrigatório.'
    },  
    telefone:{
        type: String,
        required: 'Campo obrigatório.'
        // required: 'Campo obrigatório.'
    }      
});

mongoose.model('Paciente', pacienteSchema);