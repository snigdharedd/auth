var express= require('express');
var passport= require('passport');
var FacebookStrategy= require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var configAuth= require('./auth');
var path= require('path');
var User= require('../schema');


passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
passport.use(new FacebookStrategy({
    clientID:configAuth.facebookAuth.clientID,
    clientSecret:configAuth.facebookAuth.clientSecret,
    callbackURL:configAuth.facebookAuth.callbackURL,
     profileFields   : configAuth.facebookAuth.profileFields
},
function(accessToken,verifyToken,profile,done){
   process.nextTick(function(){
       User.findOne({'facebook.id':profile.id},function(err,user){
           if(err){
               return done(err)
           }
           if(user){
            return done(null,user)
           }
           else{
            var newUser = new User();
            newUser.facebook.id    = profile.id;
            newUser.facebook.token = accessToken;
            newUser.facebook.name= profile.name.givenName + ' ' + profile.name.familyName;
            newUser.facebook.email=profile.emails[0].value;
            newUser.save(function(err){
                   if(err){
                       throw err
                   }
                   else{
                       done(null,newUser)
                   }
               })
           }
       })
    })
}))
passport.use(new GoogleStrategy({
    clientID:configAuth.googleAuth.clientID,
    clientSecret:configAuth.googleAuth.clientSecret,
    callbackURL:configAuth.googleAuth.callbackURL,

},
function(accessToken,verifyToken,profile,done){
   process.nextTick(function(){
       User.findOne({'google.id':profile.id},function(err,user){
           if(err){
               return done(err)
           }
           if(user){
            return done(null,user)
           }
           else{
            var newUser = new User();
            newUser.google.id    = profile.id;
            newUser.google.token = accessToken;
            newUser.google.name= profile.displayName;
            newUser.google.email=profile.emails[0].value;
            newUser.save(function(err){
                   if(err){
                       throw err
                   }
                   else{
                       done(null,newUser)
                   }
               })
           }
       })
    })
}))

module.exports=passport;
