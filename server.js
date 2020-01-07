require('./models/db')

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');

const userController = require('./controllers/userController');
const exameController = require('./controllers/exameController');
const pacienteController = require('./controllers/pacienteController');
const indexController = require('./controllers/indexController');

const app = express()
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname: '.hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('views engine', 'hbs');

app.listen(3000, function(){
    console.log('Listen to Port 3000')
})
app.get('/', (req, res) => {
    res.render('index/index.hbs', {
        viewTitle : "Home" 
    })
})
app.use('/user', userController);
app.use('/exame', exameController);
app.use('/paciente', pacienteController);
app.use('/index', indexController);


