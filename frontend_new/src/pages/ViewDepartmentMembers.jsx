import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, X } from "lucide-react";

const ViewDepartmentMembers = () => {
  const [filter, setFilter] = useState('');
  const [members, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

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

  useEffect(() => {
    const fetchDeptEmployees = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const response = await axios.get(`${baseUrl}/api/supervisor/employees/dept?departmentId=${user.department._id}`);
        setEmployees(response.data.data);
        console.log(response);
      } catch (err) {
          //handle error
      }
    };

    fetchDeptEmployees();
  }, [user]);


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {members.map((member, index) => (
        <div key={index} className="member-item">
          <p>Name: {member.firstName + " " + member.lastName}</p>
          <p>Email: {member.email}</p>
          <p>Dept: {member.department ? member.department.name : "Not Assigned"}</p>
          <br/>
        </div>
      ))}
    </div>
  );
};

export default ViewDepartmentMembers; 