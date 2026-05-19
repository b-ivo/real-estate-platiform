import { useState, useEffect } from "react";
import "./navbar2.scss";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import apiRequest from "../../lib/apiRequest.js";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!currentUser) {
      setNotificationCount(0);
      return;
    }
    const fetchNotifications = async () => {
      try {
        const res = await apiRequest.get("/users/notification");
        setNotificationCount(res.data);
      } catch {
        // silently fail
      }
    };
    fetchNotifications();
  }, [currentUser]);

  return (
    <nav>
      <div className="left">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="" />
          <span>HomeNexus</span>
        </Link>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/agents">Agents</Link>
      </div>

      <div className="right">
        <div className="themeToggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </div>
        
        {currentUser ? (
          <div className="user">
            <img src={currentUser.avatar || "/profile-img.jpeg"} alt="" />
            <span>{currentUser.username}</span>
            <Link to="/profile" className="profile">
              <div className="notification">{notificationCount > 0 ? notificationCount : ""}</div>
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <>
            <Link to="/login">Sign in</Link>
            <Link to="/register" className="register">
              Sign up
            </Link>
          </>
        )}
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>

        {open && <div className="menuOverlay" onClick={() => setOpen(false)} />}
        <div className={open ? "menu active" : "menu"}>
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
          <Link to="/agents" onClick={() => setOpen(false)}>Agents</Link>
          {currentUser ? (
            <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>Sign in</Link>
              <Link to="/register" onClick={() => setOpen(false)}>Sign up</Link>
            </>
          )}
          <div 
            onClick={() => { toggleTheme(); setOpen(false); }} 
            style={{cursor:"pointer", marginTop: "20px"}}
          >
            {theme === "light" ? "Dark Mode 🌙" : "Light Mode ☀️"}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
