import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gray-800 text-white">
      <div className="text-2xl font-bold">CEN-4020</div>
      <div className="flex gap-4">
        <Link to="/dashboard" className="no-underline">
          <button className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 text-base">
            Dashboard
          </button>
        </Link>
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
      </div>
    </nav>
  );
};

export default Header;
