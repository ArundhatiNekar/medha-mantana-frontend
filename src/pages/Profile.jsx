import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    document.body.classList.remove("auth-page");
    document.body.classList.add("faculty-dashboard"); // Use same class as dashboards
    document.body.style.overflowY = "auto";
    document.body.style.minHeight = "100vh";

    window.scrollTo(0, 0);

    return () => {
      document.body.classList.remove("faculty-dashboard");
    };
  }, []);

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="faculty-dashboard-wrapper">
      

      {/* Navbar-like Header */}
      <nav className="dashboard-navbar">
        <div className="logo">
          <h1>Medha Mantana</h1>
        </div>
        <div className="nav-buttons">
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="profile-icon"
              title="Profile"
            >
              👤
            </button>
            {showProfile && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  <h3>{user?.username || "User"}</h3>
                  <p>Role: {user?.role || "N/A"}</p>
                  <p>Email: {user?.email || "N/A"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-content max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-700 mb-2">
            👤 User Profile
          </h2>
        </div>

        <div className="glass-section text-center">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">Profile Information</h3>
          <div className="profile-info-card">
            <div className="profile-avatar">
              <span className="text-6xl">👤</span>
            </div>
            <div className="profile-details">
              <p><strong>Username:</strong> {user.username || "N/A"}</p>
              <p><strong>Email:</strong> {user.email || "N/A"}</p>
              <p><strong>Role:</strong> {user.role || "N/A"}</p>
              <p><strong>Joined:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
