"use client"

import { useEffect, useState, useRef } from "react"
import { CohereClientV2 } from "cohere-ai"
import { Send } from "lucide-react"

const CohereChat = () => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const cohere = new CohereClientV2({
    token: "bWXyUM9gislciEY3l0DhkZtPKJyGaX77cJC0qnWo",
  })

  const sendMessage = async (content) => {
    if (!content.trim()) return

    // Add user message to chat
    const userMessage = { role: "user", content }
    setMessages((prev) => [...prev, userMessage])

    setIsLoading(true)

    try {
      const res = await cohere.chat({
        model: "command-a-03-2025",
        messages: [...messages.map((msg) => ({ role: msg.role, content: msg.content })), { role: "user", content }],
      })

      // Add assistant response to chat
      if (res.message) {
        const assistantMessage = {
          role: "assistant",
          content: res.message.content[0]?.text || "No response content",
        }
        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error("Error calling Cohere API:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error processing your request.",
        },
      ])
    } finally {
      setIsLoading(false)
      setInputMessage("")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(inputMessage)
  }

  return (
    <div className="flex flex-col h-[600px] mx-auto border rounded-lg shadow-lg bg-white ">
      {/* Chat header */}
      <div className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
        <h1 className="text-xl font-bold">Chat con IA</h1>
      </div>

      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">Empieza a conversar...</div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-tl-none text-gray-800">
              <div className="flex space-x-2">
                <div
                  className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={isLoading || !inputMessage.trim()}
          >
            <Send size={28} />
          </button>
        </div>
      </form>
    </div>
  )
}

export default CohereChat
