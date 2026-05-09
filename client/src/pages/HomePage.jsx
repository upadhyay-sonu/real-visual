import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FileUploader from '../components/viewer/FileUploader';
import { getObjectsCall, deleteObjectCall } from '../api/objectApi';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchObjects = async () => {
    try {
      setLoading(true);
      const data = await getObjectsCall();
      setObjects(data);
    } catch (err) {
      setError('Failed to fetch your 3D models');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObjects();
  }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this model?')) return;
    
    try {
      await deleteObjectCall(id);
      setObjects(objects.filter(obj => obj._id !== id));
      // Optional: Show success toast
    } catch (err) {
      alert('Failed to delete model');
    }
  };

  const handleUploadSuccess = (newObject) => {
    // Navigate straight to viewer after upload
    navigate(`/viewer/${newObject._id}`);
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Welcome, {user?.username || 'User'}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage and view your 3D models</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        <div>
          <FileUploader onUploadSuccess={handleUploadSuccess} />
        </div>

        <div>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Your Models</h2>
          
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <div className="loader"></div>
            </div>
          ) : error ? (
            <div className="card" style={{ color: 'var(--danger-color)', textAlign: 'center' }}>
              {error}
            </div>
          ) : objects.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-secondary)' }}>
              <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 1rem auto' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p>You haven't uploaded any models yet.</p>
              <p>Upload a .glb file to get started.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {objects.map(obj => (
                <div key={obj._id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ overflow: 'hidden' }}>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {obj.filename}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Uploaded: {new Date(obj.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/viewer/${obj._id}`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                      View
                    </Link>
                    <button onClick={(e) => handleDelete(obj._id, e)} className="btn btn-danger" style={{ padding: '0.5rem 1rem' }}>
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
