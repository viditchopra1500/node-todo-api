var mongoose=require('mongoose')
const validator=require('validator');
const jwt=require('jsonwebtoken');
const _=require('lodash')
var UserSchema=new mongoose.Schema({             //why we need to do in schema-- as it allows me to add methods to my schema
    email:{
        type:String,
        trim:true,
        minlength:1,
        required:true,
        unique:true,
        validate:{
            validator:(v)=>{
                return validator.isEmail(v);
            },
            message: props=>`${props.value} is not a valid email`
        }
    },
    password:{
        type:String,
        require:true,
        minlength:6
    },
    tokens:[{                                      // two elements in an array
        access:{
            type:String, 
            required:true,
            default:null
        },
        token:{
            type:String,
            required:true,
            default:null
        }
    }]
});

UserSchema.methods.toJSON=function(){                    //This func determines what will be sent back to user as password(user doesnt wants to know his pass) and token (sent in header)
    var user= this;

    return _.pick(user,['_id','email'])
};

UserSchema.methods.generateAuthToken=function(){         //these methods have access to individual documents when being created.
    var user=this;                                        //This contains info of current user and in arrow functions we dont have access to this thus no access to current user
    var access='auth';                                    
    var data={_id:user._id.toHexString(),access};          //the data we want to hash
    var token=jwt.sign(data,'abc123').toString();          //see playground/hashing.js for reference


   user.tokens.push({access,token});                      // as tokens is an array 
   
   return user.save().then(()=>{
        return token;                                     //chaining promise with value return means the value will be passed in succes case and in failure an error.
    })
}

var User=mongoose.model('users',UserSchema);

module.exports={
    User
}