import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../login/Login';
import { jwtDecode } from "jwt-decode";
import Dashboard from '../dashboard/Dashboard';
import Navigation from '../navigation/Navigation';
import NotFound from '../notFound/NotFound';
import Register from '../register/Register';

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
      <main className="mx-auto w-full max-w-screen-2xl p-8">
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Login user={user} setUser={setUser} />} />
          <Route path="/users/add" element={<Register user={user} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
