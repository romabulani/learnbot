import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./authContext";
import { WEB_SOCKET_URL } from "../constants";
import { useSession } from "./sessionContext";

interface WebSocketContextType {
  socket: WebSocket | null;
  typingText: string;
  typingDone: boolean;
  chunkReceived: boolean;
  setTypingText: React.Dispatch<React.SetStateAction<string>>;
  setTypingDone: React.Dispatch<React.SetStateAction<boolean>>;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth();
  const { activeSessionId } = useSession();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [typingText, setTypingText] = useState<string>("");
  const [typingDone, setTypingDone] = useState<boolean>(true);
  const [chunkReceived, setChunkReceived] = useState<boolean>(false);

  useEffect(() => {
    if (!token) {
      console.error("Token is missing. Cannot establish WebSocket connection.");
      return;
    }
    let ws: WebSocket | null;
    if (activeSessionId) {
      ws = new WebSocket(
        `wss://${WEB_SOCKET_URL}/chat?token=${token}&sessionId=${activeSessionId}`
      );
      setSocket(ws);
    } else {
      ws = new WebSocket(`wss://${WEB_SOCKET_URL}/chat?token=${token}`);
      setSocket(ws);
    }

    ws.onopen = () => console.log("WebSocket connection established");
    ws.onclose = () => console.log("WebSocket connection closed");

    return () => ws?.close();
  }, [token, activeSessionId]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setTypingDone(false);
        setChunkReceived(false);
        if (data?.message_chunk) {
          setTypingText((prev) => {
            const updatedText = prev + data.message_chunk;
            return updatedText;
          });
        } else if (data?.message_complete) {
          setChunkReceived(true);
        }
      };

      socket.onerror = (error) => console.error("WebSocket error:", error);
    }
  }, [socket, typingText]);

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        typingText,
        typingDone,
        setTypingText,
        setTypingDone,
        chunkReceived,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
