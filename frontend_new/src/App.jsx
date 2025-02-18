import "./App.css";
import DashBoard from "./pages/Dashboard";
import Login from "./pages/Login";
import Header from "./components/Header";
import Register from "./pages/Register";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ReviewReceipts from "./pages/ReviewReceipts";
import LandingPage from "./pages/LandingPage";
import { AuthProvider } from "./context/AuthContext";
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Header />

          <header className="App-header">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashBoard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/receipts" element={<ReviewReceipts />} />
            </Routes>
          </header>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
