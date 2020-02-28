const mongoose = require('mongoose');

var exameSchema = new mongoose.Schema({
    nome:{
        type: String,
        required: 'Campo obrigatório.',
        unique: true
    },
    descricao:{
        type: String
    },
    validade:{
        type: Number,
        required: 'Campo obrigatório.'
    }
});

mongoose.model('Exame', exameSchema);