const mongoose = require('mongoose');

var exameSchema = new mongoose.Schema({
    nome:{
        type: String
    },
    descricao:{
        type: String
    },
    validade:{
        type: Number
    }
});

mongoose.model('Exame', exameSchema);