const MongoClient=require('mongodb').MongoClient;



MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        console.log('Unable to connect to Mongodb server')
    }
    else{
        console.log('Connected to Mongodb server');

        // db.collection('Todos').insertOne({
        //     text:'something to do',
        //     completed:false
        // },(err,result)=>{
        //     if(err){
        //         console.log('Unable to insert todo',err);
        //     }
        //     else{
                // console.log(JSON.stringify(result.ops,undefined,2))
        //     }
        // })

        // db.collection('users').insertOne({
        //     name:'vidit',
        //     age:19,
        //     location:'India'
        // },(err,result)=>{
        //     if(err) console.log('shit happens');
        //     else{
        //         console.log(JSON.stringify(result.ops[0]._id.getTimestamp(),undefined,2));
        //     }
        // })

        db.close();
    }
});