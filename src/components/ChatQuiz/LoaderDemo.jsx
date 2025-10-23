import React from 'react';
import Loader from './components/Loader';
import './index.css';

const LoaderDemo = () => {
  return (
    <div className="chat-quiz-container">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: '30px',
        }}
      >
        <h2 style={{ color: 'white', marginBottom: '20px' }}>Three Dot Loader Demo</h2>

        <div
          style={{
            background: '#2d3748',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #4a5568',
          }}
        >
          <p style={{ color: '#e2e8f0', marginBottom: '10px', textAlign: 'center' }}>
            Default Loader
          </p>
          <Loader />
        </div>

        <div
          style={{
            background: '#1a202c',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #4a5568',
          }}
        >
          <p style={{ color: '#e2e8f0', marginBottom: '10px', textAlign: 'center' }}>
            Loading message...
          </p>
          <Loader />
        </div>

        <div
          style={{
            background: '#2a4365',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #4a5568',
          }}
        >
          <p style={{ color: '#e2e8f0', marginBottom: '10px', textAlign: 'center' }}>
            Chat is typing...
          </p>
          <Loader />
        </div>
      </div>
    </div>
  );
};

export default LoaderDemo;
