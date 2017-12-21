module.exports={
    "facebookAuth":{
        "clientID":"1509467902455707",
        "clientSecret":"e30c20d95296c734ba7628ef70a02b81",
        "callbackURL":"http://localhost:7000/auth/facebook/callback",
        'profileFields' : ['id', 'name','displayName' ,'emails']

    },
    "googleAuth":{
      "clientID": "256228255382-i8sonp2hogpu9lhqs16ui5fhfdm717gb.apps.googleusercontent.com",
      "clientSecret": "HFH64IDyQ16KIdapTMLVcn_D",
      "callbackURL": "http://localhost:7000/auth/google/callback"
    }
}
