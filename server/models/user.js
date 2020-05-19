var mongoose=require('mongoose')
const validator=require('validator');
const jwt=require('jsonwebtoken');
const _=require('lodash')
const bcrypt =require('bcryptjs');

var UserSchema=new mongoose.Schema({             //why we need to do in schema--> as it allows me to add methods to my schema
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

//WHY ALL THESE METHODS ARE MADE-> SO THAT ROUTES WILL HAVE ACCESS TO INDIVIDUAL DOCS/ENTRIES CREATED.



//This func determines what will be sent back to user as password(user doesnt wants to know his pass) and token (sent in header)
UserSchema.methods.toJSON=function(){                    
    var user= this;

    return _.pick(user,['_id','email'])
};

//these methods have access to individual documents when being created.
//'this' contains info of current user ,why not arrow function ->as we dont have access to this thus no access to current user        
UserSchema.methods.generateAuthToken=function(){
    var user=this;                                        
    var access='auth';   

    //the data we want to hash
    var data={_id:user._id.toHexString(),access};

    //creating the token and converting it to string as what we get back is an array not string.          
    var token=jwt.sign(data,'abc123').toString();          

    // as user.tokens is an array
   user.tokens.push({access,token});                       
   
   return user.save().then(()=>{
        //chaining promise with value return means the value will be passed in success case and in failure an error.
        return token;                                     
    })
}

UserSchema.statics.findByCredentials=function(email,password){
    var User=this;

    return User.findOne({email}).then((user)=>{

        return new Promise((resolve,reject)=>{
            bcrypt.compare(password,user.password,(err,res)=>{
                if(err)
                reject(err);
                else
                resolve(user);
            })
        })
    })
};

//statics-->is kind of methods but now the function will become model methods not instance.
UserSchema.statics.findByToken=function(token){     
     //here model is 'this' (in model methods the model is this)           
    var User=this;     

    //decoded will contain the decoded data ie user id and token as a result.                                       
    var decoded;

    //as it might happen if token is invalid so error is thrown by jwt.verify()
    try{
        decoded=jwt.verify(token,'abc123')
    } catch(e){
        // it straightaway rejects a promise thus catch is executed as reject.
        return Promise.reject();
    }
    //returns a promise if token matches
    return User.findOne({
        '_id':decoded._id,
        
        'tokens.token':token,
        'tokens.access':'auth'
    })
}

//mongoose middleware-It lets us run certain code before or after certain events 
//eg we run some code before/after we save/update a model
//we have to mention before which event we want to run it
//used to hash password whenever a user is saved
UserSchema.pre('save',function(next){
    var user=this;
    
    if(user.isModified('password')){
        var password=user.password;
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt,(err,hash)=>{
                user.password=hash;
                next();
            });
        });
    }
    else{
        next();
    }
});

var User=mongoose.model('users',UserSchema);

module.exports={
    User
}