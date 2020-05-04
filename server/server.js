var express=require('express');
var bodyParser=require('body-parser')

const {ObjectID}=require('mongodb')
var {mongoose}=require('./db/mongoose');
var {Todo}=require('./models/todo');
var {User}=require('./models/user');

var app=express();
var port =process.env.PORT ||3000;

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    var todo=new Todo({
        text:req.body.text
    });
    todo.save().then((doc)=>{
        res.send(doc);
    }).catch((e)=>{
        res.status(400).send(e);
    })
});

app.get('/todos',(req,res)=>{
    Todo.find().then((docs)=>{
        res.send({docs})
    }).catch((e)=>{
        res.status(400).send(e);
    })
})

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

app.listen(port,()=>{
    console.log(`started on port ${port}`);
})

module.exports={
    app
}