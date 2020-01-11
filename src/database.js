const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/notes-db-app', {

        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true

    })
    .then(db => console.log('MongoDB is conected'))
    .catch(err => console.error(err));