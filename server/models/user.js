var mongoose=require('mongoose')

var User=mongoose.model('users',{
    email:{
        type:String,
        trim:true,
        minlength:1,
        required:true
    }
});

module.exports={
    User
}