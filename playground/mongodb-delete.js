const {MongoClient,ObjectID}=require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        console.log('Unable to connect to Mongodb server')
    }
    else{
        console.log('Connected to Mongodb server');
        //deleteMany
        db.collection('users').deleteMany({name:'vidit'}).then((result)=>{
            console.log(result);
        })

        //deleteOne
        db.collection('Todos').deleteOne({text:'Eat lunch'}).then((result)=>{
            console.log(result);
        })

        // findOneAndDelete
        db.collection('users').findOneAndDelete({_id:new ObjectID("5ea8084e427b912e25212560")}).then((result)=>{
            console.log(result);
        });



        // db.close();
    }
});

//deleteMany

//deleteOne

//findOneAndDelete--best