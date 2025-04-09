import React, { useState } from 'react';

const ViewDepartmentMembers = () => {
  const [filter, setFilter] = useState('');
  const members = [
    { id: 1, name: 'John Doe', role: 'Manager' },
    { id: 2, name: 'Jane Smith', role: 'Developer' },
    { id: 3, name: 'Alice Johnson', role: 'Designer' },
  ];

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-4">Department Members</h1>
      <input
        type="text"
        placeholder="Filter by name"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />
      <ul className="bg-white shadow-md rounded-lg p-6">
        {filteredMembers.map(member => (
          <li key={member.id} className="mb-2">
            <div className="flex justify-between items-center">
              <span>{member.name} - {member.role}</span>
              <button className="text-indigo-600 hover:underline">View</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewDepartmentMembers; 