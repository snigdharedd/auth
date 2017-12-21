var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var userSchema=new Schema({
   id:{
        type:Number
    },
    phone:{
        type:Number,
  },
    email:{
        type:String,
      },
    password:{
        type:String,
      },
    role:{
    type:String
    },
    firstname:{
        type:String
    },
    lastname:{
        type:String
    },
    facebook:{
        id:String,
        token:String,
        email:String,
        name:String

    },
    google:{
      id: String,
      token: String,
      name: String,
      email: String
    }

})

module.exports=mongoose.model('User',userSchema)
