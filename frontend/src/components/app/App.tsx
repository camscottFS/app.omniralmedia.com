import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../login/Login';
import { jwtDecode } from "jwt-decode";
import Dashboard from '../dashboard/Dashboard';
import Navigation from '../navigation/Navigation';
import NotFound from '../notFound/NotFound';
import Register from '../register/Register';
import Projects from '../projects/Projects';
import Invoices from '../invoices/Invoices';
import { UserType } from '../../utils/types/UserType';
import Support from '../support/Support';
import TicketCreate from '../support/TicketCreate';
import Ticket from '../support/Ticket';

const App: React.FC = () => {
  const [user, setUser] = useState<UserType | null | undefined>(undefined);

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
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/users/add" element={<Register user={user} />} />
          <Route path="/projects" element={<Projects user={user} />} />
          <Route path="/invoices" element={<Invoices user={user} />} />
          <Route path="/support" element={<Support user={user} />} />
          <Route path="/support/ticket/create/:type" element={<TicketCreate user={user} />} />
          <Route path="/support/ticket/:ticketId" element={<Ticket user={user} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
