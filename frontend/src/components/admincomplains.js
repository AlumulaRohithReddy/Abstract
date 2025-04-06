import React, { useEffect, useState } from 'react';
import { PenTool as Tool, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export const Admincomplains = () => {
  const [filter, setFilter] = useState('all');
  const [complains, setComplains] = useState([]);

  const fetchComplaints = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/c/getAllCom', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      setComplains(data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'inProgress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'inProgress': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'resolved': return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return null;
    }
  };

  const filteredComplaints = complains.filter(complaint =>
    filter === 'all' ? true : complaint.status === filter
  );

  return (
    <div className="p-6 w-screen">
      <div className="w-4/5 flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Complaints Management</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
          New Complaint
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        {['all', 'Pending', 'inProgress', 'Resolved'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'inProgress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="w-4/5 space-y-4">
        {filteredComplaints.length === 0 ? (
          <p className="text-gray-500 text-center">No complaints to show for this status.</p>
        ) : (
          filteredComplaints.map(complaint => (
            <div key={complaint.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Tool className="h-6 w-6 text-blue-500" />
                  <h3 className="text-lg font-semibold">{complaint.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(complaint.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                    {complaint.status === 'inProgress' ? 'In Progress' : complaint.status}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{complaint.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Reported: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                <button className="text-blue-500 hover:text-blue-600">View Details</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
