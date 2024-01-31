const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const database = require('./db_config.js');

const app = express();

dotenv.config();
app.set('view-engine', 'ejs');
app.use(express.urlencoded({extended: false}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true
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
    
    if(username && password) {
        const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
        
        database.query(query, (err, result) => {
            if(err){
                console.error("Error retrieving user:", err);
            }

            if(result.length === 0){
                console.error("Account not found");
            }

            const user = result[0];
            try {
                if(bcrypt.compare(password, user.password)){
                   req.session.authenticated = true;
                   req.session.user = {username: user.username, email: user.email, password: user.password};
                   return res.redirect('/home');
                }
                else {
                   console.log("Password not match");
                }
            } catch(error) {
                console.log("Error comparing password")
            }

        })
        
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
    const {username, password, email} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password);
        if(username && password && email) { 
           const query = `INSERT INTO users (username, password, email) VALUES ('${username}', '${hashedPassword}', '${email}')`;
           database.query(query, (err, result) => {
            if(err) {
                console.log("Account already exists", err);
            }
            res.redirect("/login");
           })
        } 
        else {
            console.log("Account not registered successfully");
        }
    } 
    catch(error) {
        console.log("Error: ", error)
        res.redirect("/register");
    }
});

app.listen(4000);