import { generateResponse, generateTitle } from "../services/ai.service.js";
import chatModel from '../models/chat.model.js';
import messageModel from '../models/message.model.js';

export async function sendMessage(req, res) {

    const { message, chatId } = req.body;

    let title = null, chat = null;

    // new-chat
    if(!chatId) {
        title = await generateTitle(message)
        
        chat = await chatModel.create({
            user: req.user.id,
            title
        })
        
    }

    // save user-message in the chat/messages
    const userMessage = await messageModel.create({
        chat: chat._id || chatId, 
        content: message,
        role: "user"
    })

    // find all the messages
    const messages = await messageModel.find({ chat: chatId || chat._id })
   
    console.log(messages)

    // generate response
    const result = await generateResponse(messages);

    // add AI response
    const aiMessage = await messageModel.create({
        chat: chat._id || chatId, 
        content: result,
        role: "ai"
    })
    

    res.status(201).json({
        title,
        chat,
        aiMessage
    })

}

export async function getChat(req, res) {
    const user = req.user

    const chats = await chatModel.find({
        user: user.id
    })

    res.status(200).json({
        message: 'Chats retrieved successfully',
        chats
    })
}

export async function getMessages(req, res) {
    const { chatId } = req.params;

    const chat = chatModel.findOne({
        _id: chatId,
        user: req.user.id
    })

    if(!chat) {
        return res.status(404).json({
            message: "Chat not found."
        })
    }

    const messages = await messageModel.find({
        chat: chatId
    })

    res.status(200).json({
        message: "Messages Fetched Successfully.",
        messages
    })

}

export async function deleteChat(req, res) {
    const { chatId } = req.params;

    const chat = chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    })

    await messageModel.deleteMany({
        chat: chatId
    })

    if(!chat) {
        return res.status(404).json({
            message: "Chat Not Found."
        })
    }

    res.status(200).json({
        message: "Chat deleted successfully.",
        chat
    })
}