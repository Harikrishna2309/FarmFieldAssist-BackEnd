const { Op } = require("sequelize");
const Message = require("../models/message");

// Store Message
exports.storeMessage = async (req, res) => {
    const { senderId, receiverId, message } = req.body;

    if (!senderId || !receiverId || !message) {
        return res.status(400).json({ success: false, message: "Invalid data" });
    }

    try {
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message,
        });

        res.json({ success: true, message: "Message sent successfully", data: newMessage });
    } catch (error) {
        console.error("Error storing message:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Fetch Messages between Two Users
exports.getMessages = async (req, res) => {
    const { senderId, receiverId } = req.query;

    if (!senderId || !receiverId) {
        return res.status(400).json({ success: false, message: "Invalid query parameters" });
    }

    try {
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            },
            order: [["createdAt", "ASC"]],
        });

        res.json({ success: true, data: messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
