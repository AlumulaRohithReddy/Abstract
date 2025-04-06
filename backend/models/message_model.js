const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        
        message: {
            type: String,
            required: true,
        },
        // createdAt, updatedAt
    },
    { timestamps: true }
);

module.exports = mongoose.models.message || mongoose.model('message',messageSchema);