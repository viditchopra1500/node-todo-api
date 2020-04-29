const {MongoClient,ObjectID}=require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        console.log('Unable to connect to Mongodb server')
    }
    else{
        console.log('Connected to Mongodb server');

        // db.collection('Todos').find({
        //     _id:new ObjectID("5ea8321b1b4edd06544cb23e")
        // }).toArray().then((docs)=>{
        //     console.log(JSON.stringify(docs,undefined,2));
        // }).catch((e)=>{
        //     console.log('unable to fetch todos',err);
        // });
        db.collection('users').find({name:'vidit'}).toArray().then((docs)=>{
            console.log(JSON.stringify(docs,undefined,2));
            }).catch((e)=>{
            console.log('unable to find todos',e)
        })
        db.close();
    }
});