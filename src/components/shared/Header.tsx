import { Link } from "react-router-dom";
import { useAuth } from "../../contexts";

interface HeaderProps {
  showLogin?: boolean;
}

const Header = ({ showLogin = false }: HeaderProps) => {
  const { token, logout } = useAuth(); // Destructure logout function from useAuth

  const handleLogout = () => {
    logout(); // Log the user out by calling logout
  };

  return (
    <header className="bg-blue-600 text-white p-6">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold"><Link to="/">JavaScript AI Teacher</Link> </h1>
        {showLogin && (
          <nav>
            {token ? (
              <>
                <Link to="/chat" className="text-lg mr-4 hover:text-blue-200">
                  Start Learning
                </Link>
                {/* Log Out button */}
                <button
                  onClick={handleLogout}
                  className="text-lg bg-red-500 text-white py-2 px-4 rounded hover:bg-red-400"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-lg mr-4 hover:text-blue-200">
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="text-lg bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
