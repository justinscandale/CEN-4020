import React, { useEffect } from "react";
import ReceiptForm from "../components/ReceiptForm";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);
  return <ReceiptForm />;
};

export default Dashboard;
