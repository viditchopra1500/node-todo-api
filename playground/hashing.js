const {SHA256}=require('crypto-js');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs')

var password="123abc";

bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password,salt,(err,hash)=>{
        console.log(hash);
    });
});

var hashedPassword='$2a$10$9Ze1m.7u/HWa5Sh/IaOV6uZdfjp8aF8.1vOCHClhvl.q.PNLQlIqK'

bcrypt.compare(password,hashedPassword,(err,res)=>{
    console.log(res);
})

// var data={
//     id:11
// };

// var token=jwt.sign(data,'123abc');
// console.log(token);

// var token2="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImlhdCI6MTU4ODg3NjQzN30.yaUC3ciHG5lLkAybM-l5JlxL8frhAcpXAsQfMz-jml0"
// var decoded=jwt.verify(token2,'123abc');
// console.log('decoded',decoded);
// jwt.verify
// var msg="I am user number 3";
// var hash=SHA256(msg).toString();

// console.log('Mssg:',msg);
// console.log('hash',hash);

// var data={
//     id:4
// };
// var token={
//     data,
//     hash:SHA256(JSON.stringify(data)+"somesecret").toString()
// }

// var resultHash=SHA256(JSON.stringify(token.data)+'somesecret').toString();
// if(resultHash===token.hash){
//     console.log('data was not changed');
// }
// else{
//     console.log('data was changed.do not trust');
// }