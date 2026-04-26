"use client";

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Eye, Truck, RefreshCw } from 'lucide-react';

interface DriverApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  vehicleType: string;
  experience: string;
  status: string;
  createdAt: string;
}

export default function AdminDriversPage() {
  const [applications, setApplications] = useState<DriverApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<DriverApplication | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/driver/apply?status=pending');
      const data = await response.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApproval = async (applicationId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch('/api/driver/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, action }),
      });
      if (response.ok) {
        fetchApplications();
        setSelectedApp(null);
      }
    } catch (error) {
      console.error('Error processing:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F5D50]"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Driver Applications</h1>
            <p className="text-gray-500 mt-1">Review and approve driver applications</p>
          </div>
          <button onClick={fetchApplications} className="flex items-center gap-2 px-4 py-2 bg-[#2F5D50] text-white rounded-lg hover:bg-[#23483E]">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <Truck size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No pending driver applications</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">{app.fullName}</h3>
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full flex items-center gap-1">
                        <Clock size={12} /> Pending
                      </span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3 text-sm">
                      <p><span className="text-gray-500">Email:</span> {app.email}</p>
                      <p><span className="text-gray-500">Phone:</span> {app.phone}</p>
                      <p><span className="text-gray-500">Vehicle:</span> {app.vehicleType}</p>
                      <p><span className="text-gray-500">Experience:</span> {app.experience} years</p>
                      <p><span className="text-gray-500">Applied:</span> {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedApp(app)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1">
                      <Eye size={14} /> View
                    </button>
                    <button onClick={() => handleApproval(app.id, 'approve')} className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1">
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button onClick={() => handleApproval(app.id, 'reject')} className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1">
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Details Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedApp(null)}>
            <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-4">Application Details</h2>
              <div className="space-y-3">
                <div><label className="font-medium text-gray-700">Full Name:</label> <p>{selectedApp.fullName}</p></div>
                <div><label className="font-medium text-gray-700">Email:</label> <p>{selectedApp.email}</p></div>
                <div><label className="font-medium text-gray-700">Phone:</label> <p>{selectedApp.phone}</p></div>
                <div><label className="font-medium text-gray-700">Vehicle Type:</label> <p>{selectedApp.vehicleType}</p></div>
                <div><label className="font-medium text-gray-700">Experience:</label> <p>{selectedApp.experience} years</p></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => handleApproval(selectedApp.id, 'approve')} className="flex-1 bg-green-600 text-white py-2 rounded-lg">Approve</button>
                <button onClick={() => handleApproval(selectedApp.id, 'reject')} className="flex-1 bg-red-600 text-white py-2 rounded-lg">Reject</button>
                <button onClick={() => setSelectedApp(null)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
