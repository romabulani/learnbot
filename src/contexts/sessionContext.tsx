import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./authContext";
import axios from "axios";
import { API_URL } from "../constants";
import { Message, Session } from "../types";

interface SessionContextType {
  sessions: Session[];
  activeSessionId: string | null;
  createSession: () => Promise<void>;
  switchSession: (sessionId: string) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setActiveSessionId: (sessionId: string) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth(); // Get token from authContext
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get<{ sessions: Session[] }>(
          `${API_URL}/sessions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        response.data.sessions.reverse();
        setSessions(response.data.sessions);
        setActiveSessionId(response.data.sessions[0]?.session_id);
        await fetchMessages(response.data.sessions[0]?.session_id);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    if (token) {
      fetchSessions();
    }
  }, [token]);

  const fetchMessages = async (session_id: string) => {
    try {
      const response = await axios.get<{ messages: Message[] }>(
        `${API_URL}/messages?session_id=${session_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  const createSession = async () => {
    try {
      const resp = await axios.post(
        `${API_URL}/sessions`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const newSession = {
        session_id: resp.data.session_id,
        username: "New Chat",
      };
      setSessions((prevSessions) => [newSession, ...prevSessions]);
      setActiveSessionId(newSession.session_id);
      setMessages([]);
    } catch (error) {
      console.error("Error creating new session:", error);
    }
  };

  const switchSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setMessages([]);
    fetchMessages(sessionId);
  };

  return (
    <SessionContext.Provider
      value={{
        sessions,
        activeSessionId,
        createSession,
        switchSession,
        messages,
        setMessages,
        setActiveSessionId,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
