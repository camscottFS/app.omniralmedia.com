import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserType } from '../../utils/types/UserType';
import { isAdmin } from '../../utils/isAdmin';
import Button from '../button/Button';
import { useNavigate } from 'react-router-dom';
import Message from '../message/Message';
import { verifyUser } from '../../utils/verifyUser';

interface RegisterProps {
  user: UserType | null | undefined;
}

const Register: React.FC<RegisterProps> = ({ user }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('2');
  const [clientId, setClientId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const decodedToken = verifyUser(token);

    if (!decodedToken) {
      sessionStorage.removeItem('token');
      navigate('/');
    }
    document.title = 'Omniral Media - Add User';
    if (user && !isAdmin(user)) navigate('/')
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = sessionStorage.getItem('token');

      await axios.post(`${process.env.REACT_APP_API_HOST}/auth/register`,
        {
          firstName,
          lastName,
          username,
          email: emailInput,
          password,
          roleId: parseInt(roleId, 10),
          clientId: parseInt(clientId, 10),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('User registered successfully');
      // Clear form fields
      setFirstName('');
      setLastName('');
      setUsername('');
      setEmailInput('');
      setPassword('');
      setRoleId('2');
      setClientId('');
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
        setPassword('');
      } else {
        setError('An error occurred while registering the user.');
        setPassword('');
      }
    }
  };

  return (
    <div className="lg:w-1/2 md:w-full">
      <h1 className="text-3xl text-blue-900 mb-8">Add User</h1>
      {error && <Message message={error} type="error" />}
      {success && <Message message={success} type="success" />}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="emailInput" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="emailInput"
            className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="roleId" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="roleId"
            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
          >
            <option value="2">Client</option>
            <option value="3">Support</option>
            <option value="1">Admin</option>
          </select>
        </div>
        {roleId === '2' && (
          <div>
            <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
              Client ID
            </label>
            <input
              type="text"
              id="clientId"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter client id"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button text="Add User" type="submit" />
      </form>
    </div>
  );
};

export default Register;
