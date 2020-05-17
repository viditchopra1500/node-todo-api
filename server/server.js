var express=require('express');
var bodyParser=require('body-parser')
var _=require('lodash')
const {ObjectID}=require('mongodb')

var {autheticate}=require('./middleware/authenticate')
var {mongoose}=require('./db/mongoose');
var {Todo}=require('./models/todo');
var {User}=require('./models/user');
mongoose.set('useFindAndModify', false);
//initially all the routes made are public routes ie any one can hit these and change data.
//once authentication is completed all these will be private and u need to be logged in to
//manipulate data that u actually own so tasks -->
//1)send x-auth token to user when user signups.
//2)validate a x-auth token from user.
//3)see which token belongs to which user.

var app=express();                            
var port =process.env.PORT ||3000;  

//middleware(always run for all routes when server is running)
app.use(bodyParser.json());                   


app.get('/user/me',autheticate,(req,res)=>{
    res.send(req.user)
})

//use when user posts a todo
app.post('/todos',(req,res)=>{  
    //to create a new document(new entry) in Todo collection             
    var todo=new Todo({
        text:req.body.text
    });
    todo.save().then((doc)=>{
        res.send(doc);
    }).catch((e)=>{
        res.status(400).send(e);
    })
});

//use when user wants all available todos
app.get('/todos',(req,res)=>{                 
    Todo.find().then((docs)=>{
        res.send({docs})
    }).catch((e)=>{
        res.status(400).send(e);
    })
})

//use when user wants a particular todo
app.get('/todos/:id',(req,res)=>{             
    var id =req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send('ID not valid')
    }

    Todo.findById(id).then((todo)=>{
        if(!todo){
            return res.status(404).send('id not found');
        }
        res.status(200).send({todo})
    }).catch((e)=>{
        res.status(400).send(e)
    });
})

//use when to delete a specific todo
app.delete('/todos/:id',(req,res)=>{          
    var id =req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send('ID not valid')
    }
    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo){
            return res.status(404).send('id not found'); 
        }
        res.status(200).send({todo})
    }).catch((e)=>{
        res.status(400).send(e);
    })
})

//to update a particular todo (as completed)
app.patch('/todos/:id',(req,res)=>{                   
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

    Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>{
        res.status(400).send(e);
    })
})

//to store a new user
app.post('/user',(req,res)=>{                              
    var body=_.pick(req.body,['email','password']);
    var newUser=new User(body);
    newUser.save().then(()=>{
        return newUser.generateAuthToken();                   

    }).then((token)=>{                                     //chaining a then call to get value as a return not promise as a return(also legal)

        res.header('x-auth',token).send(newUser);               
    })
    .catch((e)=>{
        res.status(400).send(e);
    })
})

app.listen(port,()=>{
    console.log(`started on port ${port}`);
})

module.exports={
    app
}