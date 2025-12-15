import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/DeveloperApplications.module.css';

const DeveloperApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('/applications/my-applications');
      setApplications(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch applications');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading applications...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="developer-applications">
      <h1>My Applications</h1>
      
      {applications.length === 0 ? (
        <p>You haven't applied to any offers yet.</p>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app._id} className="application-card">
              <div className="application-header">
                <h2>{app.offerId.title}</h2>
                <span className={`status ${app.status}`}>{app.status}</span>
              </div>
              
              <div className="application-details">
                <p><strong>Organization:</strong> {app.offerId.organizationId.name}</p>
                <p><strong>Description:</strong> {app.offerId.description}</p>
                <p><strong>Contract:</strong> {app.offerId.contractType}</p>
                <p><strong>Location:</strong> {app.offerId.preferredLocalisation}</p>
                <p><strong>Experience Level:</strong> {app.offerId.experienceLevel}</p>
                <p><strong>Salary:</strong> ${app.offerId.salary.min} - ${app.offerId.salary.max}</p>
                
                <div className="skills-section">
                  <strong>Required Skills:</strong>
                  <div className="tags">
                    {app.offerId.requiredSkills.map((skill, idx) => (
                      <span key={idx} className="tag">{skill}</span>
                    ))}
                  </div>
                </div>
                
                <div className="frameworks-section">
                  <strong>Required Frameworks:</strong>
                  <div className="tags">
                    {app.offerId.requiredFrameworks.map((fw, idx) => (
                      <span key={idx} className="tag">{fw}</span>
                    ))}
                  </div>
                </div>
                
                {app.coverLetter && (
                  <p><strong>Cover Letter:</strong> {app.coverLetter}</p>
                )}
                
                <p className="applied-date">
                  <strong>Applied:</strong> {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeveloperApplications;