import React from 'react';

const ControlPanel = ({ onReset, onToggleRotate, onScreenshot }) => {
  const handleDownloadScreenshot = () => {
    const dataUrl = onScreenshot();
    if (dataUrl) {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `screenshot-${Date.now()}.png`;
      a.click();
    }
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '1rem',
      background: 'rgba(30, 41, 59, 0.8)',
      backdropFilter: 'blur(10px)',
      padding: '1rem',
      borderRadius: '1rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
      zIndex: 20
    }}>
      <button onClick={onReset} className="btn btn-secondary">
        Reset Camera
      </button>
      <button onClick={onToggleRotate} className="btn btn-secondary">
        Toggle Auto-rotate
      </button>
      <button onClick={handleDownloadScreenshot} className="btn btn-primary">
        Screenshot
      </button>
    </div>
  );
};

export default ControlPanel;
