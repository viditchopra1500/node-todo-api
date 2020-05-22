var express=require('express');
var bodyParser=require('body-parser')
var _=require('lodash')
const {ObjectID}=require('mongodb')
const bcrypt=require('bcryptjs')

var {autheticate}=require('./middleware/authenticate')
var {mongoose}=require('./db/mongoose');
var {Todo}=require('./models/todo');
var {User}=require('./models/user');
mongoose.set('useFindAndModify', false);
//initially all the routes made were public routes ie any one can hit these and change data.
//once authentication is completed all these will be private and u need to be logged in to
//manipulate data that u actually own so tasks -->
//1)send x-auth token to user when user signups.
//2)validate a x-auth token from user.
//3)see which token belongs to which user.

var app=express();                            
var port =process.env.PORT ||3000;  

//middleware(always run for all routes when server is running)
app.use(bodyParser.json());                   


//use when user posts a todo
app.post('/todos',autheticate,(req,res)=>{  
    //to create a new document(new entry) in Todo collection             
    var todo=new Todo({
        text:req.body.text,
        _creator:req.user._id             //the association b/w todo and user
    });
    todo.save().then((doc)=>{
        res.send(doc);
    }).catch((e)=>{
        res.status(400).send(e);
    })
});

//use when user wants all available todos
app.get('/todos',autheticate,(req,res)=>{                 
    Todo.find({
        _creator:req.user._id
    }).then((docs)=>{
        res.send({docs})
    }).catch((e)=>{
        res.status(400).send(e);
    })
})

//use when user wants a particular todo
app.get('/todos/:id',autheticate,(req,res)=>{             
    var id =req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send('ID not valid')
    }

    Todo.findOne({id,
        _creator:req.user._id
    }).then((todo)=>{
        if(!todo){
            return res.status(404).send('id not found');
        }
        res.status(200).send({todo})
    }).catch((e)=>{
        res.status(400).send(e)
    });
})

//use when to delete a specific todo
app.delete('/todos/:id',autheticate,(req,res)=>{          
    var id =req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send('ID not valid')
    }
    Todo.findOneAndRemove({id,
        _creator:req.user._id
    }).then((todo)=>{
        if(!todo){
            return res.status(404).send('id not found'); 
        }
        res.status(200).send({todo})
    }).catch((e)=>{
        res.status(400).send(e);
    })
})

//to update a particular todo (as completed)
app.patch('/todos/:id',autheticate,(req,res)=>{                   
    var id=req.params.id;
    var body=_.pick(req.body,['text','completed']);
    
    if(!ObjectID.isValid(id)){
        return res.status(404).send('ID not valid')
    }

    if(_.isBoolean(body.completed)&&body.completed){
        body.completedAt=new Date().getTime();
    }else{
        body.completed=false;
        body.completedAt=null;
    }

    Todo.findOneAndUpdate({id,
        _creator:req.user._id
    },{$set:body},{new:true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>{
        res.status(400).send(e);
    })
})

//to store a new user(sign up)
app.post('/users',(req,res)=>{                              
    var body=_.pick(req.body,['email','password']);
    var newUser=new User(body);
    newUser.save().then(()=>{
        return newUser.generateAuthToken();     

    //chaining a then call to get value as a return not promise as a return(also legal)
    }).then((token)=>{                                     

        res.header('x-auth',token).send(newUser);               
    })
    .catch((e)=>{
        res.status(400).send(e);
    })
})

//when i have a token now i need to authenticate it
//its just authenticating that the token is valid or not
app.get('/users/me',autheticate,(req,res)=>{
    res.send(req.user)
})

app.post('/users/login',(req,res)=>{
    var email=req.body.email;
    var password=req.body.password;

    //imp point to note: we keep the chain alive by returning thus we
    //return till we can get an error(so it can be catched) thus for all promises we always return 
    //so that we can use catch..
    User.findByCredentials(email,password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.header('x-auth',token).send(user);               
        })

    }).catch(e=>{
        res.status(400).send(e);
    })
});
//to logout and thus remove/delete the current token. 
app.delete('/users/me/token',autheticate,(req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    }).catch(e=>{
        res.status(400).send(e);
    })
})

app.listen(port,()=>{
    console.log(`started on port ${port}`);
})

module.exports={
    app
}