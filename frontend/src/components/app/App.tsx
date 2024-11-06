import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../login/Login';
import { jwtDecode } from "jwt-decode";
import Dashboard from '../dashboard/Dashboard';
import Navigation from '../navigation/Navigation';

const App: React.FC = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      // @ts-ignore
      setUser(decodedToken.user);
    }
  }, []);

  return (
    <Router>
      {user && <Navigation user={user} setUser={setUser} />}
      <Routes>
        <Route path="/" element={<Login user={user} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
