import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== "supervisor") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "supervisor") {
    return null;
  }

  return (
    <div>
      <h1>Supervisor Dashboard</h1>
      <button onClick={() => navigate('/get-reports')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        Get Reports
      </button>
    </div>
  );
};

export default Dashboard;
