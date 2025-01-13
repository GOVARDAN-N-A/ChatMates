import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Moon, Sun, User, Settings } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [theme, setTheme] = useState("dark");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Check and apply theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
      backdrop-blur-md bg-base-100/80 shadow-sm transition-all duration-300 ease-in-out"
    >
      <div className="container mx-auto px-4 lg:px-8 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-all">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold text-primary hidden sm:block">ChatMates</h1>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4 relative">
            {/* Settings Icon for Mobile */}
            <button
              className="flex sm:hidden items-center justify-center w-9 h-9 rounded-lg hover:bg-base-300/30 transition-all"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {isSettingsOpen && (
              <div
                ref={settingsRef}
                className="absolute top-full right-0 mt-2 w-48 bg-base-100 border border-base-300 rounded-lg shadow-lg"
              >
                {authUser && (
                  <>
                    <Link
                      to={"/profile"}
                      className="block px-4 py-2 text-sm hover:bg-base-200 rounded-t-lg transition-all"
                      onClick={() => setIsSettingsOpen(false)}
                    >
                      <User className="inline-block w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-base-200 transition-all"
                      onClick={() => {
                        logout();
                        setIsSettingsOpen(false);
                      }}
                    >
                      <LogOut className="inline-block w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </>
                )}
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-base-200 rounded-b-lg transition-all"
                  onClick={() => {
                    toggleTheme();
                    setIsSettingsOpen(false);
                  }}
                >
                  {theme === "dark" ? (
                    <>
                      <Moon className="inline-block w-4 h-4 mr-2" />
                      Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun className="inline-block w-4 h-4 mr-2" />
                      Light Mode
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-4">
              {authUser && (
                <>
                  <Link
                    to={"/profile"}
                    className="btn btn-ghost btn-sm gap-2 hover:bg-base-300/30 transition-all"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden md:inline font-medium">Profile</span>
                  </Link>
                  <button
                    className="btn btn-ghost btn-sm gap-2 hover:bg-base-300/30 transition-all"
                    onClick={logout}
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden md:inline font-medium">Logout</span>
                  </button>
                </>
              )}
              <button
                className="btn btn-ghost btn-sm gap-2 hover:bg-base-300/30 transition-all"
                onClick={toggleTheme}
              >
                {theme === "dark" ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
