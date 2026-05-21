import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Authpage from './pages/AuthPage';
import Landingpage from './pages/Landingpage';
import Notfoundpage from './pages/Notfoundpage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/auth" element={<Authpage />} />
        <Route path="*" element={<Notfoundpage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;