import { initializeSocketConnection } from "../services/chat.socket";

export const useChatHook = () => {
    return {
        initializeSocketConnection
    }
}