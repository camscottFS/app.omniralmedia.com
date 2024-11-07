import React, { useState } from "react";
import { Spin as Hamburger } from 'hamburger-react';
import Logo from "../../assets/logo.png";
import UserMenu from "../userMenu/UserMenu";
import { useNavigate } from "react-router-dom";

interface NavigationProps {
  user: any;
  setUser: (user: any) => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, setUser }) => {
  const [isOpen, setOpen] = useState(false)

  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav className="w-full bg-white shadow-lg" style={{ zIndex: 999 }}>
      <div className="mx-auto w-full flex items-center justify-between py-4 max-w-screen-2xl px-8">
        <div className="flex items-center space-x-2">
          <a href="/">
            <img src={Logo} alt="Omniral Media - web design & development" className="h-6 w-auto" />
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex space-x-6 mr-5">
            <a href="#product" className="text-gray-700 hover:text-blue-900 transition-colors">
              My Projects
            </a>
            <a href="/invoices" className="text-gray-700 hover:text-blue-900 transition-colors">
              Invoices
            </a>
          </div>
          <UserMenu
            user={user}
            onLogout={() => {
              sessionStorage.removeItem('token');
              setUser(null);
              navigate('/');
            }}
          />
        </div>
        <div className="md:hidden">
          <div className="text-blue-800">
            <Hamburger size={24} toggled={isOpen} toggle={setOpen} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
