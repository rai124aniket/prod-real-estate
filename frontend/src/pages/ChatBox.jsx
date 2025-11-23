import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../useContext/useAuth";
import { useParams } from "react-router-dom";

const ChatBox = () => {
  const { user } = useAuth();
  const { receiverId } = useParams(); 
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);

  // --- LOGIC REMAINS UNCHANGED ---
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/chat/${receiverId}`, {
          withCredentials: true,
        })
        setMessages(res.data)
      } catch (err) {
        console.error("Error fetching chats", err)
      }
    }

    fetchChats();
  }, [receiverId]);


  useEffect(() => {
    if (!user) return

    ws.current = new WebSocket("ws://localhost:3000")

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ type: "register", userId: user.id }))
    };

    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      setMessages((prev) => [
        ...prev,
        { senderId: msg.senderId, content: msg.content },
      ])
    }

    return () => {
      ws.current.close()
    }

  }, [user])

  
  const sendMessage = async () => {
    if (!input.trim() || !user) return

    try {
      const res = await axios.post(
        `http://localhost:3000/chat/${receiverId}`,
        { content: input },
        { withCredentials: true }
      );

      setMessages((prev) => [...prev, res.data]);

      ws.current.send(
        JSON.stringify({
          type: "chat",
          senderId: user.id,
          receiverId,
          content: input,
        })
      );

      setInput("");
    } catch (err) {
      console.error("Error sending message", err);
    }
  };
  // --- END LOGIC ---

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-6">
      
      {/* Main Chat Container */}
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[85vh] border border-gray-100">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                    {receiverId ? receiverId.slice(0,2).toUpperCase() : "??"}
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 text-sm">Chat</h3>
                  
                </div>
            </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scroll-smooth">
          {messages.length === 0 && (
             <div className="text-center text-gray-400 text-sm mt-10">No messages yet. Say hi! 👋</div>
          )}
          
          {messages.map((msg, i) => {
            const isMe = msg.senderId === user?.id;
            return (
                <div
                    key={i}
                    className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                >
                    <div
                        className={`px-4 py-2.5 max-w-[75%] break-words shadow-sm text-sm leading-relaxed
                        ${isMe 
                            ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm" 
                            : "bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-sm"
                        }`}
                    >
                        {msg.content}
                    </div>
                </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-100 px-2 py-2 rounded-full border border-transparent focus-within:border-blue-300 focus-within:bg-white transition-all duration-200">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent px-3 outline-none text-sm text-gray-700 placeholder-gray-400"
                />
                <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className={`p-2.5 rounded-full flex items-center justify-center transition-all duration-200
                        ${input.trim() 
                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:scale-105" 
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                   {/* Inline SVG Send Icon */}
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 pl-0.5">
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ChatBox;