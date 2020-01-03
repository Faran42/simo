const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'Esse campo é obrigatório.'
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    city: {
        type: String
    }
});

mongoose.model('User', userSchema);