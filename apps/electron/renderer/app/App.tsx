import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './Home';
import Chat from './Chat';
import Config from './Config';
import { enableMapSet } from "immer";
import { useMountedApp } from './redux/store';
import {  ToastContainer } from 'react-toastify';

enableMapSet();

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const app = useMountedApp();

  useEffect(() => {
    if (!app.user.apiKey && location.pathname !== '/config') {
      navigate('/config');
    }
  }, [app.user.apiKey, navigate]);

  useEffect(() => {
    const handleLocationChange = (url: string) => {
      // Remove leading slash if present
      const path = url.startsWith('/') ? url.slice(1) : url;
      if (!app.user.apiKey && path !== 'config') {
        // If API key is not set and user is not on /config, prevent navigation
        console.log('API key not set. Redirecting to /config');
        navigate('/config');
      } else {
        navigate(`/${path}`);
      }
    };

    (window as any).electron.receive('location-change', handleLocationChange);
  }, [navigate, app.user.apiKey]);

  useEffect(() => {
    (window as any).electron.send('content-loaded');
  }, []);

  return (
    <div id="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/config" element={<Config />} />
      </Routes>
      <ToastContainer
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
        />
    </div>
  );
};

const App: React.FC = () => {
  return (
      <Router>
        <AppContent />
      </Router>
  );
};

export default App;