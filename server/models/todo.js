var mongoose=require('mongoose');

var Todo=mongoose.model('Todo',{
    text:{
        type: String,
        required:true,
        minlength:1,
        trim: true
    },
    completed:{
        type: Boolean,
        default:false,
    },
    completedAt:{
        type: Number,
        default:null
    },
    _creator:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
});

module.exports={
    Todo
};

//IF a todo needs to be associated to a user we need a way to 
//set up that association (we did this by (_creator))