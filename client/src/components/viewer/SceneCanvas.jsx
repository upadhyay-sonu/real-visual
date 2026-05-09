import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { useThreeScene } from '../../hooks/useThreeScene';

const SceneCanvas = forwardRef(({ modelUrl, savedCameraState, onCameraChange }, ref) => {
  const canvasRef = useRef(null);
  
  const { 
    loading, 
    error, 
    resetCamera, 
    toggleAutoRotate, 
    takeScreenshot 
  } = useThreeScene(canvasRef, modelUrl, savedCameraState, onCameraChange);

  // Expose these methods to the parent component (ControlPanel will need them)
  useImperativeHandle(ref, () => ({
    resetCamera,
    toggleAutoRotate,
    takeScreenshot
  }));

  return (
    <div className="canvas-wrapper">
      {loading && (
        <div className="loader-container" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, background: 'rgba(15, 23, 42, 0.8)' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="loader" style={{ margin: '0 auto 1rem auto' }}></div>
            <p>Loading 3D Model...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, color: 'var(--danger-color)', textAlign: 'center', background: 'var(--surface-color)', padding: '2rem', borderRadius: '1rem' }}>
          <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 1rem auto', display: 'block' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>{error}</p>
        </div>
      )}

      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%', display: 'block' }} 
      />
    </div>
  );
});

export default SceneCanvas;
