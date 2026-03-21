import { initializeSocketConnection } from "../services/chat.socket";
import { sendMessage, getChat, getMessages, deleteChat } from "../services/chat.api.js";
import { addNewMessage, createNewChat, setChats, setCurrentChat, setError, setLoading } from "../chat.slice";
import { useDispatch } from 'react-redux';

export const useChatHook = () => {

    const dispatch = useDispatch();

    async function handleSendMessage({ message, chatId }) {
        try{
            dispatch(setLoading(true))
            const data = await sendMessage({ message, chatId })
            const { chat, aiMessage } = data
            dispatch(createNewChat({
                chatId: chat._id,
                title: chat.title
            }))

            dispatch(addNewMessage({
                chatId: chat._id,
                content: message,
                role: "user"
            }))

            dispatch(addNewMessage({
                chatId: chat._id,
                content: aiMessage.content,
                role:aiMessage.role 
            }))

            dispatch(setCurrentChat(chat._id))

        }catch(err) {
            console.log(err)
        }
    }

    return {
        initializeSocketConnection,
        handleSendMessage
    }
}