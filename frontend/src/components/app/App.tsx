import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { UserType } from '../../utils/types/UserType';
import Login from '../login/Login';
import Dashboard from '../dashboard/Dashboard';
import Navigation from '../navigation/Navigation';
import NotFound from '../notFound/NotFound';
import Register from '../register/Register';
import Projects from '../projects/Projects';
import Invoices from '../invoices/Invoices';
import Support from '../support/Support';
import TicketCreate from '../support/TicketCreate';
import Ticket from '../support/Ticket';
import SettingsProfile from '../settings/SettingsProfile';

const App: React.FC = () => {
  const [user, setUser] = useState<UserType | null | undefined>(undefined);

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload & { user: UserType }>(token);

        // Check if token is expired
        if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
          // Token is expired, log out
          sessionStorage.removeItem('token');
          setUser(undefined);
          window.location.href = '/';
        } else {
          // Token is valid, set user
          setUser(decodedToken.user);
        }
      } catch (err) {
        console.error('Invalid token:', err);
        sessionStorage.removeItem('token');
        setUser(undefined);
        window.location.href = '/';
      }
    } else {
      setUser(null);
    }
  }, []);

  return (
    <Router>
      {user && <Navigation user={user} setUser={setUser} />}
      <main className="mx-auto w-full max-w-screen-2xl p-8">
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Login user={user} setUser={setUser} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/users/add" element={<Register user={user} />} />
          <Route path="/projects" element={<Projects user={user} />} />
          <Route path="/invoices" element={<Invoices user={user} />} />
          <Route path="/support" element={<Support user={user} />} />
          <Route path="/support/ticket/create/:type" element={<TicketCreate user={user} />} />
          <Route path="/support/ticket/:ticketId" element={<Ticket user={user} />} />
          <Route path="/settings/profile" element={<SettingsProfile user={user} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
