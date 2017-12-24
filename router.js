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
      var email = req.body.email;
      var password = req.body.password;
      var phone= req.body.phoneno;

        User.findOne({$or: [
        {'email':email},
        {'phoneno':phoneno}
      ]},function(err,user){
        if(!user){
          res.json('email or phoneno is wrong')
        }
        else if(user){
          bcrypt.compare(password,user.password,function(err,result){
            if(!result){
              res.json('wrong password')
            }else{
              const token = JWT.sign( {id:user._id},config.secret);
              return res.send({user:true,token:token})
            }

          })
        }

      })
     })

router.get('/auth/facebook',passport.authenticate('facebook',{scope:'email'}))
router.get('/auth/facebook/callback',passport.authenticate('facebook',{successRedirect : '/profile',
failureRedirect : '/index'}))

router.get('/auth/google',passport.authenticate('google',{scope:'email'}))
router.get('/auth/google/callback',passport.authenticate('google',{successRedirect : '/profile',
failureRedirect : '/index'}))


router.post('/register',function(req,res){
  const ID = req.body.ID;
  const type= req.body.type;
  const email= req.body.email;
  const phone= req.body.phone;
  const role= req.body.role;
  const firstname= req.body.firstname;
  const lastname= req.body.lastname;
  const password= req.body.password;

  let newuser = new User();
  newuser.ID = ID;
  newuser.type= type;
  newuser.attributes.email= email;
  newuser.attributes.phone= phone;
  newuser.attributes.role= role;
  newuser.attributes.firstname= firstname;
  newuser.attributes.lastname= lastname;
  newuser.attributes.password= password;
  User.findOne({$or: [
    {'attributes.email':email},
    {'attributes.phone': phone}
]},function(err,user){
    if(err){
      console.log('error')
    }
    if(user){
      res.json('email or phoneno is already taken');
    }
    bcrypt.genSalt(10,function(err,salt){
      bcrypt.hash(newuser.attributes.password,salt,function(err,hash){
        if(err){
          console.log('err');
        }
        newuser.attributes.password=hash;

        newuser.save(function(err){
          if(err){
            console.log('err')
          }else{
            res.send(user);
          }
    })
  })
})
})
})

  module.exports=router;
