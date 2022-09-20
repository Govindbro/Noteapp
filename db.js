const mongoose=require('mongoose');
const mongooseUrl="mongodb+srv://Govind1:govind@cluster0.y5tinn1.mongodb.net/noteapp";
const connetMongo=()=>{
    try{
        mongoose.connect(mongooseUrl,()=>console.log("conntected with mongoos"));
    }catch{
        console.log("kjdfkdjk")
    }
}
module.exports=connetMongo



// node js me package => bcrytjs inthat generate salt metheod are there