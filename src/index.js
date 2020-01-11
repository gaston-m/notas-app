const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const passport = require('passport');


//Inicializaciones

const app = express();
require('./database');
require('./config/passport');


//Configuraciones

app.set('view engine', '.hbs');

app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs({ 
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
}));



app.set('port', process.env.PORT || 5000);





//Middlewares


app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
    secret: "mysecretapp",
    resave: true,
    saveUninitialized: true,
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());





//Constantes Globales
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;



    next();
});



//Routes

app.use(require('./routes/index.js'));
app.use(require('./routes/users.js')); //Puede traer preoblemas esta barra....pero si no tira error..
app.use(require('./routes/notes.js'));


//Static Files

app.use(express.static(path.join(__dirname, 'public')));


//Server listning 

app.listen(app.get('port'), () => {

    console.log('Server listening on port', app.get('port'))
});