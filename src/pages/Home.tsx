import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts";
import { Header, Footer } from "../components";


const Home: React.FC = () => {
  const { token } = useAuth();
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header showLogin />

      <section className="bg-white py-16 flex-grow flex items-center justify-center">
        <div className="container text-center">
          <h3 className="text-3xl font-semibold mb-4">
            Ready to Start Learning?
          </h3>
          <p className="text-lg mb-8">
            Join thousands of learners who are mastering JavaScript with
            AI-powered lessons.
          </p>
          <Link
            to={token ? "/chat" : "/signup"}
            className="bg-blue-600 text-white py-3 px-8 rounded-lg text-lg hover:bg-blue-500"
          >
            Get Started
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
