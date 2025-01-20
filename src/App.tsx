import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import { AuthProvider, SessionProvider, WebSocketProvider } from "./contexts";
import { ProtectedRoute } from "./components";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SessionProvider>
        <WebSocketProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </WebSocketProvider>
      </SessionProvider>
    </AuthProvider>
  );
};

export default App;
