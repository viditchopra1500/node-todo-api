const {mongoose}=require('./../server/db/mongoose')
const {Todo}=require('./../server/models/todo')
const {ObjectID}=require('mongodb')
const {User}=require('./../server/models/user')
var id="5eab17cb4f076f2461dfd824";

if(!ObjectID.isValid(id)){
    console.log('ID not valid')
}
// Todo.find({
//     completed: false
// }).then((todos)=>{
//     console.log('Todos',todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo)=>{
//     console.log('Todo',todo);
// });

User.findById(id).then((user)=>{
    if(!user){
        return console.log('user not Found')
    }
    console.log('email by id',JSON.stringify(user,undefined,2));
}).catch((e)=>{
    console.log(e)
});