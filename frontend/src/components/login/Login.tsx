import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Logo from "../../assets/logo.png";
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { UserType } from '../../utils/types/UserType';
import Button from '../button/Button';
import Message from '../message/Message';

interface LoginProps {
  user: UserType | null;
  setUser: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ user, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = "Omniral Media - Login";
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:3000/api/auth/login`, {
        email,
        password,
      });

      const { token } = response.data;

      sessionStorage.setItem('token', token);

      const decodedToken = jwtDecode(token);
      // @ts-ignore
      setUser(decodedToken.user);

    } catch (error: any) {
      // Handle errors
      if (error.response && error.response.data) {
        setError(error.response.data.message);
        setPassword('');
      } else {
        setError('An error occurred. Please try again.');
        setPassword('');
      }
    }
  };

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <img src={Logo} alt="Logo" className="w-40 mx-auto" />
        {error && (
          <Message message={error} type="error" />
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button text="Login" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default Login;