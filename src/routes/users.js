const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require ('passport');

router.get('/users/signin', function(req, res) {
    res.render('users/signin');

});

router.post('/users/signin', passport.authenticate('local', {

    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true

}));

router.get('/users/signup', (req, res) => {

    res.render('users/signup')

});

router.post('/users/signup', async (req, res) =>{
    console.log(req.body);
    const {name, email, password, confirm_password} = req.body;
    const errors = [];

    if (name.length <= 0){
        errors.push({text: 'Por favor Inserte un Nombre'});
    };

    if (password.length < 4 ){
        errors.push({text: 'La Contarseña debe contener a menos 4 caracteres'});
    };
    if (password != confirm_password){
        errors.push({text: 'Las Contraseñas NO Coinciden'});
    };

/////PRUEBA

/*const emailUser =  await User.findOne({email: email});
     if (emailUser != null){
         errors.push({text:'El E-mail Ya esta en uso...'})
            

     }
*/

    if (errors.length > 0 ){

        
        res.render('users/signup', {errors, name, email, password, confirm_password});
     
    } else{
        console.log('ESTOY EN EL ELSE')

        const emailUser = await User.findOne({email: email});
        if (emailUser != null){

            console.log('Estoy en el else if')
            req.flash('error_msg', 'Email Ingresado Ya Esta en Uso');
            res.redirect('/users/signup');

        } else{

        console.log('ESTOY EN EL ELSE ELSE')

        const newUser = new User ({name, email, password});
        newUser.password = await newUser.encryptPassword (password);  
        await newUser.save();
        req.flash('success_msg', 'Te Has Registrado Satisfactoriamente');
        res.redirect('/users/signin');
        };
    }

});

router.get('/users/logout', (req,res) =>{
   
    req.logOut();
    res.redirect('/');
});


module.exports = router;