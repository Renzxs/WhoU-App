const express = require('express');
const app = express();

app.set('view-engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index.ejs', { name: 'John'});
})

app.get('/login', (req, res) => {
    res.render('login.ejs', { name: 'John'});
})

app.get('/register', (req, res) => {
    res.render('register.ejs', { name: 'John'});
})

app.listen(4040);