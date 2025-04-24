import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Receipt, Clock, Search, Shield, ChartBar, Upload } from "lucide-react";
import FeatureCards from "../components/FeatureCards";

const LandingPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const renderActionButtons = () => {
    if (!user) {
      return (
        <div className="mt-10 flex justify-center gap-4">
          <Link to="/login">
            <button className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-800 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
              Register
            </button>
          </Link>
        </div>
      );
    }

    if (user.role === "supervisor" || 1) {
      return (
        <div className="mt-10 flex gap-4 justify-center">
          <Link to="/dashboard">
            <button className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
              Go to Dashboard
            </button>
          </Link>
          {user.role === "supervisor" && <>
              <Link to="/approve-receipts">
                <button className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                  Approve Receipts
                </button>
              </Link>
              <Link to="/get-reports">
                <button className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                  Get Reports
                </button>
              </Link>
              <Link to="/generate-report">
                <button className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                  Generate Report
                </button>
              </Link>
          </>}
          <Link to="/view-department-members">
            <button className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
              View Department Members
            </button>
          </Link>
        </div>
      );
    }

    return (
      <div className="mt-10 flex justify-center">
        <Link to="/receipts">
          <button className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
            Review Receipts
          </button>
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-blue-500 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              EERIS
            </h1>
            <p className="mt-3 max-w-md mx-auto text-xl text-indigo-100 sm:text-2xl md:mt-5 md:max-w-3xl">
              Employee Expense Reporting Information System
            </p>
            {renderActionButtons()}
          </div>
        </div>
      </div>

      <FeatureCards />

      {/* CTA Section - Only show if not logged in */}
      {!user && (
        <div className="bg-indigo-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Ready to Get Started?
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Join thousands of users who trust EERIS for their expense
                reporting needs
              </p>
              <div className="mt-8">
                <Link to="/register">
                  <button className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                    Create Your Account
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
