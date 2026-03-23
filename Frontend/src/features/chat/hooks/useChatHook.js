import { initializeSocketConnection } from "../services/chat.socket";
import { sendMessage, getChat, getMessages, deleteChat } from "../services/chat.api.js";
import { addMessages, addNewMessage, createNewChat, setChats, setCurrentChat, setError, setLoading } from "../chat.slice";
import { useDispatch } from 'react-redux';

export const useChatHook = () => {

    const dispatch = useDispatch();

    async function handleSendMessage({ message, chatId }) {
        
            dispatch(setLoading(true))
            const data = await sendMessage({ message, chatId })
            const { chat, aiMessage } = data
            if(!chatId)
                dispatch(createNewChat({
                    chatId: chat._id,
                    title: chat.title
                }))
            
            dispatch(addNewMessage({
                chatId: chatId || chat._id,
                content: message,
                role: "user"
            }))

            dispatch(addNewMessage({
                chatId: chatId || chat._id,
                content: aiMessage.content,
                role:aiMessage.role 
            }))
            dispatch(setCurrentChat(chat._id))
        
    }

    async function handleGetChats() {
        dispatch(setLoading(true))
        const data = await getChat()
        const { chats } = data
        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[ chat._id ] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updatedAt
            }
            return acc;
        }, {})))
        dispatch(setLoading(false))
    }

    async function handleOpenChat(chatId, chats) {

        if(chats[chatId].messages.length <= 0){

            const data = await getMessages(chatId)
            const { messages } = data
            
            const formattedMessage = messages.map(msg => ({
                content: msg.content,
                role: msg.role
            }))
            dispatch(addMessages({
                chatId, messages: formattedMessage
            }))
        }
        dispatch(setCurrentChat(chatId))
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat
    }
}