import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ViewerPage from './pages/ViewerPage';

function App() {
  return (
    <ErrorBoundary>
      <div className="app">
        <Toaster position="top-center" />
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/viewer/:id" 
            element={
              <ProtectedRoute>
                <ViewerPage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;
