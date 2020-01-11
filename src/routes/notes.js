const express = require('express');
const router = express.Router();
const { isAuthenticated } = require ('../helpers/auth');
const Note = require('../models/Note');


router.get('/notes/add', isAuthenticated, (req, res) => {

    res.render('notes/new-note');


});


router.post('/notes/new-note', isAuthenticated, async function(req, res) {

    const { title, descripcion } = req.body;

    const errors = [];

    if (!title) {

        errors.push({ text: "Por favor inserte un titulo" });
    };
    if (!descripcion) {
        errors.push({ text: "Inserte una descripcion" });
    }

    if (errors.length > 0) {

        res.render('notes/new-note', {

            errors,
            title,
            descripcion
        })
    } else {

        const NewNote = new Note({ title, descripcion });

        NewNote.user = req.user.id;

        await NewNote.save();
        req.flash('success_msg', 'Nota Agregada Satisfactoriamente');
        res.redirect('/notes');


    };


});


router.get('/notes', isAuthenticated,  async function(req, res) {

    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'});

    res.render('notes/all-notes', { notes });


});


router.get('/notes/edit/:id', isAuthenticated,  async(req, res) => {

    const note = await Note.findById(req.params.id);
    res.render('notes/edit-note', { note });


});


router.put('/notes/edit-note/:id', isAuthenticated, async(req, res) => {

    const { title, descripcion } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title, descripcion });
    req.flash('success_msg', 'Nota Editada Satisfactoriamente :vD')
    res.redirect('/notes');
});

router.delete('/notes/delete/:id',isAuthenticated,  async (req, res)=>{
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Nota Eliminada Satisfactoriamente');
    res.redirect('/notes');


});



module.exports = router;