var mongoose=require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.Promise=global.Promise;  //It tells mongoose to use nodes default promises 
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports={
    mongoose
}