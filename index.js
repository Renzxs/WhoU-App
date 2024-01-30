const express = require('express');
const session = require('express-session');
const app = express();
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

const users = [];

dotenv.config();
app.set('view-engine', 'ejs');
app.use(express.urlencoded({extended: false}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false
}));

app.get('/', (req, res) => {
    if(req.session.authenticated) {
        res.redirect('/home');
    } else {
        res.redirect('/login');
    }
})

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.post('/login', (req, res) => {
    const {username, password} = req.body;

    if(username === "Florence" && password === "123"){
        req.session.authenticated = true;
        req.session.user = { "username": username, "password": password}
        
        res.redirect("/home");
    } else {
        res.json({message : "Account not found"});
    }
});

app.get("/home", (req, res) => {
    if(req.session.authenticated) {
        res.render("home.ejs", {isAuthenticated: true ,user: req.session.user});
    }
    else {
        res.redirect('/login')
    }
})

app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            console.log(err);
        }
        else {
            res.redirect('/login');
        }
    })
})

app.get('/register', (req, res) => {
    res.render('register.ejs', { name: 'John'});
})

app.post('/register', async (req, res) => {
    const {username, password} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        users.push({"id": crypto.randomUUID(), 
        "username": username,
        "password":  hashedPassword
        });
    
        res.redirect("/login");
    } 
    catch(error) {
        console.log("Error: ", error)
        res.redirect("/register");
    }
});

app.listen(4040);