require('./models/db')

const {base, urlLocal, porta} = require('./util/baseUrl')

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
app.use(express.static('views')) //aponta o caminho da pasta views e por consequencia o css dela
app.set('views engine', 'hbs');
app.engine('hbs', exphbs({ extname: '.hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));


const url = base+urlLocal+porta


app.listen(porta, function(){
    
    console.log("Url: "+`${url}`)
})

app.get('/', (req, res) => {
    res.render('index/index.hbs', {
        viewTitle : "Home",
        baseUrl : url,
        baseUrlExame : urlLocal+porta+"/exame/"
    })
})

// chamada de controles
app.use('/user', userController);
app.use('/exame', exameController);
app.use('/paciente', pacienteController);
app.use('/index', indexController);


