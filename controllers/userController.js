const express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const User = mongoose.model('User');
const moment = require('moment');

router.get('/', (req, res) => {
    res.render('user/addOrEdit.hbs',{
        viewTitle : "Insira um novo usuário",
        
    });
});

router.get('/data', (req, res) => {
    
    const {dias} = req.query;
      
    moment.locale('pt-br')
    const data = moment().format('LTS');
   
    const data1 = moment().subtract(dias, 'days').calendar(); // 01/20/2020
    
    const data2 = moment().subtract(dias, 'days').calendar();  // Last Friday at 9:46 AM
    const data3 = moment().subtract(dias+1, 'days').calendar();  // Last Monday at 9:46 AM
    
    const data4 = moment().subtract(dias, 'days').calendar();  // Yesterday at 9:46 AM
    if(data3<data4)
        console.log('data3',data3)
    else
        console.log('data4', data4)
    
    const data5 = moment().calendar();                      // Today at 9:46 AM
    const data6 = moment().add(dias, 'days').calendar();       // Tomorrow at 9:46 AM
    const data7 = moment().add(dias, 'days').calendar();       // Sunday at 9:46 AM
    const data8 = moment().add(dias, 'days').calendar(); 
   
    const data9 = moment().format('LT');   // 11:08

    const data10 = moment().format('LTS');  // 11:08:42
    const data11 = moment().format('L');    // 30/01/2020
    const data12 = moment().format('l');    // 30/1/2020
    const data13 = moment().format('LL');   // 30 de Janeiro de 2020
    const data14 = moment().format('ll');   // 30 de Jan de 2020
    const data15 = moment().format('LLL');  // 30 de Janeiro de 2020 às 11:08
    const data16 = moment().format('lll');  // 30 de Jan de 2020 às 11:08
    const data17 = moment().format('LLLL'); // Quinta-feira, 30 de Janeiro de 2020 às 11:08
    const data18 = moment().format('llll');
    
    res.render('user/data.hbs',{
        viewTitle : "Teste de manipulação de datas",
        data : data, 
        data1 : data1, 
        data2 : data2,
        data3 : data3, 
        data4 : data4, 
        data5 : data5, 
        data6 : data6, 
        data7 : data7, 
        data8 : data8,
        data9 : data9, 
        data10 : data10,
        data11 : data11, 
        data12 : data12, 
        data13 : data13, 
        data14 : data14, 
        data15 : data15, 
        data16 : data16,  
        data17 : data17,  
        data18 : data18  
        
    });
});



router.post('/', (req, res) => {
    if(req.body._id ==''){
        insertRecord(req, res);
    }        
    else{
        updateRecord(req, res);
    }
       
});

function insertRecord( req, res){
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.mobile = req.body.mobile;
    user.city = req.body.city;
    user.save((err, doc) => {
        if(!err)
            res.redirect('user/list')
        else {
            if(err.name == 'ValidationError'){
                handleValidationError(err, req.body);
                res.render('user/addOrEdit.hbs',{
                    viewTitle : "Insira um novo usuário",
                    user : req.body
                });
            }
                

            console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res){
    User.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, doc) => {
        if(!err){
            res.redirect('User/list');
        }
        else{
            if(err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("User/addOrEdit", {
                    viewTitle: 'Update User',
                    User: req.body
                });
            }
            else{
                console.log('Error during record update: ' + err);
            }            
        }
    });
};

router.get('/list', (req, res) => {
    // res.json('from list');
    User.find((err, docs) => {
        if(!err){
            res.render("user/list.hbs", {
                list: docs
            });
        }
        else{
            console.log('Error in retrieving employee list:' + err);
        }
    });
});

function handleValidationError(err, body){   
    for(field in err.errors){
        switch(err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, doc) => {
        if(!err){
            res.render("user/addorEdit.hbs", {
                viewTitle: "Update user",
                user: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, docs) => {
        if(!err){
            res.redirect('/user/list');
        }
        else{
            console.log('Error in user delete: ' + err);
        }
    });
});



module.exports = router;
