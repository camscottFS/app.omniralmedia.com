import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../login/Login';
import { jwtDecode } from "jwt-decode";

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
      <Routes>
        <Route path="/" element={<Login user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
