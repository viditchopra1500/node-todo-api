const {MongoClient,ObjectID}=require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        console.log('Unable to connect to Mongodb server')
    }
    else{
        console.log('Connected to Mongodb server');

        //findOneAndUpdate
        db.collection('users').findOneAndUpdate({
            _id:new ObjectID('5ea8081de869442e13f242ba')
        },{
            $set:{
                name:'vidit'
            },
            $inc:{
                age:1
            }
        },{
            returnOriginal:false
        }).then((result)=>{
            console.log(result);
        })

        // db.close();
    }
});
