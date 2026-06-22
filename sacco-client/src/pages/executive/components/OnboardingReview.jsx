import React, { useEffect, useState } from 'react';
import api from '../../../api/axios';

const OnboardingReview = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setError('');
        // FIX, Changed 'axios' to 'api' and removed the duplicate '/api' prefix
        const response = await api.get('/onboarding/applications');
        setApplications(response.data);
      } catch (err) {
        // Handle empty database states gracefully
        if (err.response?.status === 404) {
          setApplications([]);
        } else {
          setError('Failed to fetch questionnaire submissions. Ensure you have Executive permissions.');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <div className="p-6 text-center text-gray-600">Loading applications...</div>;
  if (error) return <div className="p-6 text-center text-red-500 font-semibold">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-1 text-gray-800">Onboarding Questionnaires</h2>
      <p className="text-sm text-gray-500 mb-6">Review newly submitted member registration details below.</p>

      {applications.length === 0 ? (
        <div className="text-center py-12 text-gray-500 border border-dashed border-gray-200 rounded-lg bg-gray-50/50">
          No onboarding questionnaires found.
        </div>
      ) : (
        <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
          <table className="min-w-full bg-white text-left text-sm text-gray-700 border-collapse">
            <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-600 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 font-medium text-center" style={{ width: '80px' }}>ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Status / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-gray-500 text-center">{app.id}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {app.fullName || app.name || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {app.phoneNumber}
                  </td>
                  <td className="py-3 px-4">
                    <button 
                      className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-all cursor-pointer"
                      onClick={() => alert(`Reviewing details for ID: ${app.id}`)}
                    >
                      View Full Answers
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OnboardingReview;