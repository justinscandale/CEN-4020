import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gray-800 text-white">
      <Link to="/" className="no-underline">
        <button className="text-2xl font-bold text-white hover:text-gray-300 transition-colors duration-200">
          CEN-4020
        </button>
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-300">
              Welcome, {user.firstName} {user.lastName}
              {user.role === "supervisor" && " (Supervisor)"}
            </span>
            {user.role === "supervisor" && (
              <Link to="/dashboard" className="no-underline">
                <button className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 text-base">
                  Dashboard
                </button>
              </Link>
            )}
            {user.role === "employee" && (
              <>
                <Link to="/receipts" className="no-underline">
                  <button className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 text-base">
                    My Receipts
                  </button>
                </Link>
                <Link to="/receipts/new" className="no-underline">
                  <button className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition-colors duration-200 text-base">
                    Upload Receipt
                  </button>
                </Link>
              </>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 text-base"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="no-underline">
              <button className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 text-base">
                Login
              </button>
            </Link>
            <Link to="/register" className="no-underline">
              <button className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 text-base">
                Register
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
