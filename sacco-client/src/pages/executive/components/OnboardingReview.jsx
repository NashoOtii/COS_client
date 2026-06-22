import React, { useEffect, useState } from 'react';
import api from '../../../api/axios';

const OnboardingReview = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setError('');
        const response = await api.get('/onboarding/applications');
        setApplications(response.data);
      } catch (err) {
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
    <div className="p-6 max-w-7xl mx-auto relative">
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
                      onClick={() => setSelectedApp(app)}
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

      {/* DETAILED QUESTIONNAIRE MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedApp.fullName || selectedApp.name}
                </h3>
                <p className="text-xs text-gray-500">Applicant System Reference: #{selectedApp.id}</p>
              </div>
              <button 
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-semibold bg-transparent border-none cursor-pointer"
              >
                &times;
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5">
              
              {/* Primary Profile Data */}
              <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-100/70 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-500 tracking-wider">Phone Number</span>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">{selectedApp.phoneNumber || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-500 tracking-wider">Email Address</span>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">{selectedApp.email || 'N/A'}</p>
                </div>
              </div>

              {/* Questionnaire Dynamic Responses Mapping columns from r1.png & r2.png */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Sacco Evaluation Questionnaire</h4>
                
                <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200/60">
                  <p className="text-xs font-semibold text-gray-500">1. Core Motivation for Joining</p>
                  <p className="text-sm text-gray-800 mt-1 whitespace-pre-line">
                    {selectedApp.motivation || selectedApp.Motivation || 'No response captured.'}
                  </p>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200/60">
                  <p className="text-xs font-semibold text-gray-500">2. Personal Financial Goal</p>
                  <p className="text-sm text-gray-800 mt-1 whitespace-pre-line">
                    {selectedApp.financialGoal || selectedApp.FinancialGoal || 'No response captured.'}
                  </p>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200/60">
                  <p className="text-xs font-semibold text-gray-500">3. Sacco Community Contribution Intent</p>
                  <p className="text-sm text-gray-800 mt-1 whitespace-pre-line">
                    {selectedApp.contribution || selectedApp.Contribution || 'No response captured.'}
                  </p>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200/60">
                  <p className="text-xs font-semibold text-gray-500">4. Cultural Value Alignment</p>
                  <p className="text-sm text-gray-800 mt-1 whitespace-pre-line">
                    {selectedApp.valueAlignment || selectedApp.ValueAlignment || 'No response captured.'}
                  </p>
                </div>

                <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200/60">
                  <p className="text-xs font-semibold text-gray-500">5. Weekly Financial Commitment Capacity</p>
                  <p className="text-sm text-gray-800 mt-1 whitespace-pre-line">
                    {selectedApp.weeklyCommitment || selectedApp.WeeklyCommitment || 'No response captured.'}
                  </p>
                </div>
              </div>

            </div>
            
            {/* Modal Actions Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingReview;