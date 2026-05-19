import "./layout.scss";
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar.jsx";
import CompareBar from "../../components/compareBar/CompareBar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export function RequireAuth() {
  const { currentUser } = useAuth();
  return currentUser ? (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
      <CompareBar />
    </div>
  ) : (
    <Navigate to="/login" />
  );
}

function Layout() {
  return (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
      <CompareBar />
    </div>
  );
}

export default Layout;
