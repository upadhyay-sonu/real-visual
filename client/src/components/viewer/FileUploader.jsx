import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadObjectCall } from '../../api/objectApi';

const FileUploader = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;
    
    // Check extension
    if (!selectedFile.name.toLowerCase().endsWith('.glb')) {
      setError('Only .glb files are supported');
      return false;
    }
    
    // Check size (50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const newObject = await uploadObjectCall(file, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      });
      
      console.log('Upload response:', newObject);

      setFile(null);
      setUploadProgress(0);
      
      if (onUploadSuccess) {
        onUploadSuccess(newObject);
      } else {
        // Default behavior if not overridden
        navigate(`/viewer/${newObject._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Upload 3D Model</h2>
      
      {error && (
        <div className="toast error" style={{ position: 'relative', marginBottom: '1rem', bottom: 'auto', right: 'auto' }}>
          {error}
        </div>
      )}

      <div 
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? 'var(--primary-color)' : 'var(--surface-color-hover)'}`,
          borderRadius: '1rem',
          padding: '3rem 2rem',
          textAlign: 'center',
          cursor: isUploading ? 'not-allowed' : 'pointer',
          backgroundColor: isDragging ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
          transition: 'all 0.2s',
          marginBottom: '1.5rem'
        }}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange} 
          accept=".glb" 
          style={{ display: 'none' }}
          disabled={isUploading}
        />
        
        <svg width="48" height="48" fill="none" stroke="var(--text-secondary)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 1rem auto' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        
        {file ? (
          <div style={{ fontWeight: '500', color: 'var(--primary-color)' }}>
            {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
          </div>
        ) : (
          <div>
            <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Click to upload or drag and drop</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>.GLB files up to 50MB</p>
          </div>
        )}
      </div>

      {isUploading && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div style={{ height: '8px', background: 'var(--surface-color-hover)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${uploadProgress}%`, background: 'var(--primary-color)', transition: 'width 0.2s' }}></div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button 
          onClick={handleUpload} 
          className="btn btn-primary" 
          disabled={!file || isUploading}
          style={{ width: '100%' }}
        >
          {isUploading ? 'Uploading...' : 'Upload Model'}
        </button>
      </div>
    </div>
  );
};

export default FileUploader;
