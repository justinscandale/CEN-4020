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
    </div>
  );
};

export default Dashboard;
