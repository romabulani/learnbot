import React, { useState, useEffect, useRef, FormEvent } from "react";
import { Link } from "react-router-dom";
import { useTypingEffect } from "../hooks";
import { useWebSocket, useSession } from "../contexts";
import Markdown from 'markdown-to-jsx';

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const {
    typingText,
    setTypingDone,
    chunkReceived,
    socket,
    typingDone,
    setTypingText,
  } = useWebSocket();
  const {
    messages,
    sessions,
    setMessages,
    createSession,
    activeSessionId,
    switchSession,
  } = useSession();
  const typingSpeed = 50; // Adjust typing speed (ms per character)
  const typingMessage = useTypingEffect(typingText, typingSpeed, () =>
    setTypingDone(true)
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typingDone) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "assistant", message: typingText },
      ]);
      setTypingText("");
    }
  }, [typingDone]);

  const handleSessionClick = (session_id: string) => {
    switchSession(session_id);
    if (ref) {
      ref.current?.focus();
    }
  };

  const createNewSession = async () => {
    try {
      await createSession();
      if (ref) {
        ref.current?.focus();
      }
    } catch (error) {
      console.error("Error creating new session:", error);
    }
  };

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error("Cannot send message: WebSocket is not open.");
      return;
    }
    if (message.trim()) {
      socket.send(JSON.stringify({ message, session_id: activeSessionId }));
      setMessages((prevMessages: any) => [
        ...prevMessages,
        { sender: "user", message },
      ]);
      setMessage("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingMessage]);

  return (
    <div className="flex h-screen">
      {/* Sessions Sidebar */}
      <div className="w-1/4 bg-gray-200 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">
          <Link to="/">Javascript AI Teacher</Link>
        </h2>
        <button
          onClick={createNewSession}
          className="w-full p-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + New Chat
        </button>
        <ul className="space-y-2">
          {sessions?.map((session) => (
            <li
              key={session.session_id}
              className={`p-2 cursor-pointer rounded-lg ${
                activeSessionId === session.session_id
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
              onClick={() => handleSessionClick(session.session_id)}
            >
              {session.session_name ?? "Unnamed Chat"}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Panel */}
      <div className="w-3/4 flex flex-col relative">
        <div className="flex-grow overflow-y-auto p-4 bg-gray-100 pb-20">
          <div className="space-y-2">
            {messages.map((msg, index) =>
              msg.message ? (
                <div
                  key={index}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <span
                    className={`text-sm ${
                      msg.sender === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    {msg.sender === "user" ? "You" : "Assistant"}
                  </span>
                  <p
                    className={`bg-white rounded-lg p-2 shadow ${
                      msg.sender === "user"
                        ? "bg-blue-200 text-blue-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    <Markdown>
                      {msg.message}
                    </Markdown> 
                  </p>
                </div>
              ) : (
                <></>
              )
            )}
            {typingMessage && chunkReceived && (
              <div className="flex flex-col items-start">
                <span className="text-sm text-left">Assistant</span>
                <p className="rounded-lg p-2 shadow bg-green-200 text-green-800">
                  {typingMessage}
                </p>
              </div>
            )}
            <div ref={messagesEndRef}></div>
          </div>
        </div>

        {/* Fixed Input */}
        <form
          className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-gray-300 flex items-center"
          onSubmit={sendMessage}
        >
          <input
            ref={ref}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 focus:outline-none"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
