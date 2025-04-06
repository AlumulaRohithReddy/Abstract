const mongoose = require('mongoose')
const mongouri ="mongodb+srv://atharvareddy145:QplC15pxjFt2FH6K@cluster0.ldhq5p6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const connectToMongo =async ()=>{
    mongoose.connect(mongouri,()=>{
     
         console.log('connected to mongose succesfullly')
    })
}
module.exports= connectToMongo;