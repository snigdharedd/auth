var express=require('express');
var router=express.Router();
var jwt=require('jsonwebtoken');
var bcrypt=require('bcryptjs');
var passport=require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth=require('./models/auth')
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
require('./models/passport');
var config=require('./config')
var verifytoken=require('./models/token');
var User=require('./schema')

router.get('/getusers',verifytoken,function(req,res){
        User.findById(req.userid, { password: 0 }, function (err, user) {
 if (err) return res.send("error");
 if (!user) return res.send("No user found.");
           else{
            res.send(user);
           }
          });
    })
    router.put('/update',verifytoken,function(req,res){
        var firstname=req.body.firstname;
        var lastname=req.body.lastname;
        User.findByIdAndUpdate(req.userid,{firstname:firstname,lastname:lastname},function(err,user){
           if(err){
               res.send('err')
           }
           if(!user){
               res.send('no user found')
           }
           else {
               res.send('updated sucessfully' +user)
           }



        })
    })



router.post('/login',function(req,res){
    var phone=req.body.phone;
    var email=req.body.email;
    var password=req.body.password;
    User.findOne({$or:[{'phone':phone},{'email':email}]},function(err,user){
        if(err){
            res.send(err)
        }

        if(!user){
            res.json({sucess:false,msg:"email or phoneno is wrong"})
        }


            var passwordIsValid = bcrypt.compareSync( req.body.password,user.password)
           var token=jwt.sign({id:user._id},'secret')
           if(!passwordIsValid){
               res.status(401).send({sucess:false,token:null})
           }
        res.status(200).send({auth:true,token:token})
    })
})





router.get('/auth/facebook',passport.authenticate('facebook',{scope:'email'}))
router.get('/auth/facebook/callback',passport.authenticate('facebook',{successRedirect : '/profile',
failureRedirect : '/index'}))

router.get('/auth/google',passport.authenticate('google',{scope:'email'}))
router.get('/auth/google/callback',passport.authenticate('google',{successRedirect : '/profile',
failureRedirect : '/index'}))

router.post('/signup',function(req,res){
    var hashedPassword = bcrypt.hashSync(req.body.password)
    var id=req.body.id;
    var phone=req.body.phone;
    var email=req.body.email;
    var password=hashedPassword;
    var role=req.body.role;
    var firstname=req.body.firstname;
     var lastname=req.body.lastname;
    var countryCode=req.body.countryCode;

    var newUser=new User();
    newUser.id=id;
    newUser.phone=phone;
    newUser.email=email;
    newUser.password=hashedPassword;
    newUser.role=role;
    newUser.firstname=firstname;
    newUser.lastname=lastname;


    User.findOne({$or:[{'phone':phone},{'email':email}]},function(err,user){
        if(err){
        res.send(err)
        }
        if(user){
            res.json({msg:'email / phone already taken'})
        }
else{

            newUser.save(function(err,savedfile){
                if(err){
                    res.status(404).send()
                }
                else{
                    res.status(201).send(savedfile)
                }
            })
        }
    })

})

  module.exports=router;
