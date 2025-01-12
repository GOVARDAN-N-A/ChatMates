import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Moon, Settings, Sun, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [theme, setTheme] = useState("dark");

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);

    // Save theme to localStorage
    localStorage.setItem("theme", newTheme);
  };

  // Check and apply theme on mount
  useEffect(() => {
    // Get the saved theme from localStorage or default to "dark"
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
      backdrop-blur-lg bg-base-100/80 transition-all duration-300 ease-in-out"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">ChatMates</h1>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Settings Button */}
            <Link
              to={"/settings"}
              className="btn btn-sm gap-2 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                {/* Profile Button */}
                <Link to={"/profile"} className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                {/* Logout Button */}
                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}

            {/* Theme Toggle Button */}
            <button
              className="flex gap-2 items-center transition-all duration-300 ease-in-out"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Moon className="size-5" />
              ) : (
                <Sun className="size-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
