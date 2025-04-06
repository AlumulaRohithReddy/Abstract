require('dotenv').config()
const connectToMongo = require('./db')
const express = require('express')
const multer = require('multer')

connectToMongo();
const app = express()
var cors = require('cors');
const cookieParser = require("cookie-parser");
var bodyParser = require('body-parser');
const fetchuser = require('./middleware/fetchuser');

const User = require('./models/user');
const Message = require('./models/message_model')
// const { default: protectRoute } = require('./middleware/protectRoute');
app.use(cors({ origin:true, credentials:true }));
app.use(cookieParser());
app.use(bodyParser.json());
// app.use(cors());
const port = 5000
app.use(express.json())
app.use('/api/auth',require('./routes/auth'))
app.use('/api/g',require('./routes/gate_stoken'))
app.use('/api/c',require('./routes/complains_route'))
app.use('/api/b',require('./routes/room_allot'))
app.use('/api/a',require('./routes/attendence'))
app.use('/api/f',require('./routes/feedback'))
// app.use("/api/payment", require('./routes/payment/request_payment'))
app.use('/api/admin_auth',require('./routes/admin_routes/admin_auth'))
app.use('/api/ad',require('./routes/admin_routes/getallusers'))
app.use('/api/ud',require('./routes/admin_routes/updates'))
app.get('/', (req, res) => {
  res.send('Hello World!')
})





app.post("/api/messages/send",fetchuser,async (req,res)=>{
    try {
        const {message} = req.body;
        const senderId = req.user
        console.log(message)
        let user = await User.findById(senderId)
        if(!user){
            return res.status(400).json({error:"login to message"})

        }
        const newMessage = await Message.create({
            senderId:senderId,
            message:message
        })

        if(newMessage){
            newMessage.save()
            res.status(201).json(newMessage)
        }
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" })
    }
})

app.get("/api/messages/get",async(req,res)=>{
    try {
        const messages = await Message.find().populate("senderId","name")
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch messages", error });
    }
})













app.listen(port, () => {
  console.log(`iNotebook backend listening on port http://localhost:${port}`)
})
