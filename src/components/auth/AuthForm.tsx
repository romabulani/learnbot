import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../../utils";
import Footer from "../shared/Footer";
import Header from "../shared/Header";
import { useAuth } from "../../contexts";

interface AuthFormProps {
  mode: "login" | "signup";
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const { login, token } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isLogin = mode === "login";

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const endpoint = isLogin ? "/login" : "/signup";
      const response = await axiosInstance.post(
        endpoint,
        new URLSearchParams({ username, password }).toString()
      );
      const token = isLogin ? response.data.access_token : response.data.token;
      login(token);
      navigate("/chat");
    } catch (err: any) {
      if (err?.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError(
          `Error during ${isLogin ? "login" : "signup"}. Please try again.`
        );
      }
    }
  };

  const handleGuestLogin = async () => {
    setUsername("johndoe");
    setPassword("Hello@123");
    try {
      const response = await axiosInstance.post(
        "/login",
        new URLSearchParams({
          username: "johndoe",
          password: "Hello@123",
        }).toString()
      );
      login(response.data.access_token);
      navigate("/chat");
    } catch (err: any) {
      if (err?.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Error during login as guest. Please try again.");
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">
            {isLogin ? "Log In" : "Sign Up"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className={`w-full p-2 ${
                isLogin
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-green-500 hover:bg-green-600"
              } text-white rounded`}
            >
              {isLogin ? "Log In" : "Sign Up"}
            </button>
            {isLogin && (
              <button
                type="button"
                onClick={handleGuestLogin}
                className="w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Login as Guest
              </button>
            )}
            {error && <p className="text-red-500 text-center">{error}</p>}
          </form>
          <p className="text-center mt-4 text-gray-600">
            {isLogin ? "Don’t have an account? " : "Already have an account? "}
            <Link
              to={isLogin ? "/signup" : "/login"}
              className="text-blue-500 hover:underline"
            >
              {isLogin ? "Sign up here" : "Log in here"}
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AuthForm;
