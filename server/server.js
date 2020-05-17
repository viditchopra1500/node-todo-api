var express=require('express');
var bodyParser=require('body-parser')
var _=require('lodash')
const {ObjectID}=require('mongodb')
var {mongoose}=require('./db/mongoose');
var {Todo}=require('./models/todo');
var {User}=require('./models/user');
mongoose.set('useFindAndModify', false);
//initially all the routes made are public routes ie any one can hit these and change data.
//once authentication is completed all these will be private and u need to be logged in to
//manipulate data that u actually own.

var app=express();                            // object of express
var port =process.env.PORT ||3000;           //for heroku

app.use(bodyParser.json());                   //middleware(always run for all routes when server is running)

app.post('/todos',(req,res)=>{                //use when user posts a todo
    var todo=new Todo({
        text:req.body.text
    });
    todo.save().then((doc)=>{
        res.send(doc);
    }).catch((e)=>{
        res.status(400).send(e);
    })
});

app.get('/todos',(req,res)=>{                 //use when user wants all available todos
    Todo.find().then((docs)=>{
        res.send({docs})
    }).catch((e)=>{
        res.status(400).send(e);
    })
})

app.get('/todos/:id',(req,res)=>{             //use when user wants a particular todo
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

app.delete('/todos/:id',(req,res)=>{          //use when to delete a specific todo
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

app.patch('/todos/:id',(req,res)=>{                   //to update a particular todo (as completed)
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

app.post('/user',(req,res)=>{                              //to store a new user
    var body=_.pick(req.body,['email','password']);
    var newUser=new User(body);
    newUser.save().then(()=>{
        return newUser.generateAuthToken();
    }).then((token)=>{                                     //chaining a then call to value return not promise return
        res.header('x-auth',token).send(newUser);             //sending token as a header and user data as body  
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