var express=require('express');

var mongoose=require('mongoose')
var bodyParser=require('body-parser');
var cookieParser=require('cookie-parser');
var passport=require('passport')
var session=require('express-session')

mongoose.connect('mongodb://localhost/final')
var db=mongoose.connection;
db.once('open',function(){
  console.log("connected to db");
});

db.on('error',function(err){
  console.log(err);
});
var User= require('./schema')

var app=express();
app.use(bodyParser.json());
app.use(cookieParser())
app.use(session({
    secret: 'mysecret',
    resave: true,
    saveUninitialized:true
  }))

app.use(passport.initialize())
app.use(passport.session())
require('./models/passport')
var router=require('./router')
app.use('/',router);

app.get('/',function(req,res){
    res.render('index.ejs')
})

app.get('/profile',isLoggedIn,function(req, res) {
    res.render('profile.ejs',
    {

        user : req.user
      })
});


function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }


app.listen(7000);
console.log('server connected')
