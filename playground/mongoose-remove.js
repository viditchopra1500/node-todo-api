const {mongoose}=require('../server/db/mongoose')
const {Todo}=require('../server/models/todo')
const {ObjectID}=require('mongodb')
const {User}=require('../server/models/user')
mongoose.set('useFindAndModify', false);
// Todo.deleteOne({text:"eat food"}).then((result)=>{
//     console.log(result);
// }) 

// Todo.deleteMany({}).then((result)=>{
//     console.log(result);
// }) 

// Todo.findOneAndRemove({})
// Todo.findByIdAndRemove()


Todo.findByIdAndRemove('5eb1f4bb6c32d05e38a8975f').then((todo)=>{
    console.log(todo)
})