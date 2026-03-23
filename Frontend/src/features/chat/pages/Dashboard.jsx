import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useSelector } from 'react-redux'
import { useChatHook } from '../hooks/useChatHook'

const Dashboard = () => {
    const chat = useChatHook();
    const [open, setOpen] = useState(true);
    
    const [ chatInput, setChatInput ] = useState('')

    const chats = useSelector((state) => state.chat.chats)
    const currentChatId = useSelector((state) => state.chat.currentChatId)

    const handleSubmitMessage = (event) => {
      event.preventDefault()

      const trimmedMessage = chatInput.trim()
      if (!trimmedMessage) {
        return
      }

      chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
      setChatInput('')
    }

    const openChat = ( chatId ) => {
      chat.handleOpenChat(chatId, chats)
    }

    useEffect(() => {
        chat.initializeSocketConnection()
        chat.handleGetChats()
    }, [])
   
    
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white">

      {/* Sidebar */}
      <aside className={`transition-all duration-300 ${open ? "w-64" : "w-16"} bg-zinc-900/80 backdrop-blur-md border-r border-zinc-800 p-4 flex flex-col`}>
        <button
          onClick={() => setOpen(!open)}
          className="mb-4 p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition"
        >
          ☰
        </button>

        {open && (
          <>
            <h1 className="text-xl font-semibold mb-4">Perplexity</h1>

            <div className='space-y-2'>
            {Object.values(chats).map((chat,index) => (
              <button
                onClick={()=>{openChat(chat.id)}}
                key={index}
                type='button'
                className='w-full cursor-pointer rounded-xl border border-white/60 bg-transparent px-3 py-2 text-left text-base font-medium text-white/90 transition hover:border-white hover:text-white'
              >
                {chat.title}
              </button>
            ))}
          </div>
          </>
        )}
      </aside>

      {/* Main Content */}
      <div className=" flex-1 flex flex-col">

        {/* Messages Area */}
        <div className="messages flex-1 overflow-y-auto p-6 space-y-6">
            {chats[currentChatId]?.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                        className={`${
                          msg.role === "user"
                            ? "max-w-xl bg-blue-600/20 border rounded-br-none border-blue-500/30"
                            : "max-w-4xl zinc-950"
                        } px-5 py-3 rounded-2xl backdrop-blur-sm`}
                      >
                        {msg.role === "user" ? (
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                        ) : (
                          <div className="text-sm leading-relaxed prose prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
            ))}
        </div>

        {/* Input Box */}
        <div className="p-4 border-t border-zinc-800 bg-transparent">
          <form onSubmit={handleSubmitMessage} className="flex items-center gap-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl px-3 py-2 shadow-lg">
            <input
              type="text"
              placeholder="Type your message..."
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              className="flex-1 bg-transparent px-3 py-2 outline-none placeholder:text-zinc-400"
            />
            <button className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-xl font-medium">
              Send
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Dashboard
