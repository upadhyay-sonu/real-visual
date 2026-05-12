import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SceneCanvas from '../components/viewer/SceneCanvas';
import ControlPanel from '../components/viewer/ControlPanel';
import { getObjectByIdCall, updateCameraStateCall } from '../api/objectApi';
import { getFileUrl } from '../config/api';

const ViewerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        setLoading(true);
        const data = await getObjectByIdCall(id);
        setModel(data);
      } catch (err) {
        setError('Failed to load model data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchModel();
  }, [id]);

  const handleCameraChange = async (newState) => {
    try {
      await updateCameraStateCall(id, newState.position, newState.target);
    } catch (err) {
      console.error('Failed to save camera state', err);
    }
  };

  const handleResetCamera = () => {
    if (canvasRef.current) {
      canvasRef.current.resetCamera();
    }
  };

  const handleToggleRotate = () => {
    if (canvasRef.current) {
      canvasRef.current.toggleAutoRotate();
    }
  };

  const handleScreenshot = () => {
    if (canvasRef.current) {
      return canvasRef.current.takeScreenshot();
    }
    return null;
  };

  if (loading) {
    return (
      <div className="loader-container" style={{ height: 'calc(100vh - 80px)' }}>
        <div className="loader"></div>
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>Error</h2>
          <p>{error || 'Model not found'}</p>
          <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const finalModelUrl = getFileUrl(model.path || model.fileUrl);

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 80px)', overflow: 'hidden' }}>
      {/* Top info bar */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        zIndex: 20,
        background: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 style={{ fontSize: '1.125rem', margin: 0, fontWeight: 600 }}>{model.filename}</h2>
      </div>

      {/* The 3D Canvas */}
      {process.env.NODE_ENV !== 'production' && console.log('Resolved Model URL:', finalModelUrl)}
      <SceneCanvas 
        ref={canvasRef}
        modelUrl={finalModelUrl}
        savedCameraState={model.cameraState}
        onCameraChange={handleCameraChange}
      />

      {/* Controls */}
      <ControlPanel 
        onReset={handleResetCamera}
        onToggleRotate={handleToggleRotate}
        onScreenshot={handleScreenshot}
      />
    </div>
  );
};

export default ViewerPage;
