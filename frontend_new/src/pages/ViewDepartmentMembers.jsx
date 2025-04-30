import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, X } from "lucide-react";

const ViewDepartmentMembers = () => {
  const [filter, setFilter] = useState('');
  const [members, setEmployees] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedMember, setEditedMember] = useState({});
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
        const response = await axios.get(`${baseUrl}/api/supervisor/employees/dept?departmentId=6801d0806fb18e09c4272673`);
        setEmployees(response.data.data);
        console.log(response);
        console.log(user.department.name);

      } catch (err) {
        console.log(err);
          //handle error
      }
    };

    fetchDeptEmployees();
  }, [user]);

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedMember(members[index]);
  };

  const handleSaveClick = async (index) => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const memberId = members[index]._id;
      await axios.put(`${baseUrl}/api/supervisor/employees/${memberId}`, editedMember);
      const updatedMembers = [...members];
      updatedMembers[index] = editedMember;
      setEmployees(updatedMembers);
      setEditingIndex(null);
    } catch (err) {
      console.error("Error updating member:", err);
    }
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const createUser = async () => {
    try {
      let departmentId = user && user.department ? user.department._id : null;
      if (!departmentId) {
        //default to engineer department ID
        departmentId = '6801d0806fb18e09c4272673';
      }
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const response = await axios.post(`${baseUrl}/api/auth/register`, { firstName, lastName, email, password, departmentId });
      alert('User created successfully');
      const newUser = response.data;
      setEmployees([newUser, ...members]);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      alert('Error creating user');
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`/api/users/delete/${userId}`);
      alert('User deleted successfully');
    } catch (error) {
      alert('Error deleting user');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">{user && user.department && user.department.name} Department Members</h1>
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">User Management</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <button
              onClick={createUser}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
            >
              Create User
            </button>
          </div>
        </div>
        {members.map((member, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6 mb-6 transition-transform transform hover:scale-105">
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editedMember.firstName}
                  onChange={(e) => setEditedMember({ ...editedMember, firstName: e.target.value })}
                  className="border p-2 mb-2 w-full rounded"
                  placeholder="First Name"
                />
                <input
                  type="text"
                  value={editedMember.lastName}
                  onChange={(e) => setEditedMember({ ...editedMember, lastName: e.target.value })}
                  className="border p-2 mb-2 w-full rounded"
                  placeholder="Last Name"
                />
                <input
                  type="email"
                  value={editedMember.email}
                  onChange={(e) => setEditedMember({ ...editedMember, email: e.target.value })}
                  className="border p-2 mb-2 w-full rounded"
                  placeholder="Email"
                />
                <select
                  value={editedMember.role}
                  onChange={(e) => setEditedMember({ ...editedMember, role: e.target.value })}
                  className="border p-2 mb-2 w-full rounded"
                >
                  <option value="supervisor">Supervisor</option>
                  <option value="employee">Employee</option>
                </select>
                <button onClick={() => handleSaveClick(index)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Save
                </button>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold">Role: <span className="text-gray-700">{member.role}</span></p>
                <p className="text-lg font-semibold">Name: <span className="text-gray-700">{member.firstName + " " + member.lastName}</span></p>
                <p className="text-lg font-semibold">Email: <span className="text-gray-700">{member.email}</span></p>
                <p className="text-lg font-semibold">Dept: <span className="text-gray-700">{member.department ? member.department.name : "Not Assigned"}</span></p>
                {user && user.role === 'supervisor' && (
                  <button onClick={() => handleEditClick(index)} className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600">
                    Edit
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewDepartmentMembers; 