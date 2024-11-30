import React, { useEffect, useState } from 'react';
import Button from '../button/Button';
import { ProjectType } from '../../utils/types/ProjectType';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Message from '../message/Message';

interface GeneralSupportFormProps {
  projects: ProjectType[];
  userId: number | undefined;
}

const GeneralSupportForm: React.FC<GeneralSupportFormProps> = ({ projects, userId }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    isRelated: true,
    projectId: undefined,
    category: '',
    subject: '',
    description: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = sessionStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [projects]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' || type === 'radio' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!userId) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/support/tickets/create`,
        {
          userId,
          projectId: formData.isRelated ? formData.projectId : null,
          category: formData.category,
          subject: formData.subject,
          description: formData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess('Support ticket created successfully. Redirecting...');
        setFormData({
          isRelated: false,
          projectId: undefined,
          category: '',
          subject: '',
          description: '',
        });
        setTimeout(() => {
          navigate(`/support/ticket/${response.data.ticketId}`);
        }, 3000);
      }
    } catch (err) {
      console.error('Error creating support ticket:', err);
      setError('Failed to create ticket. Please try again later.');
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && <Message type="error" message={error} />}
      {success && <Message type="success" message={success} />}
      <div>
        <label htmlFor="relatedYes" className="block text-sm font-medium text-gray-700 mb-2">
          Is this issue related to a project within your workspace?
        </label>
        <div className="flex items-center mb-2">
          <input
            id="relatedYes"
            type="radio"
            name="isRelated"
            value="true"
            checked={formData.isRelated}
            onChange={(e) => setFormData((prev) => ({ ...prev, isRelated: true }))}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor="relatedYes" className="ms-2 text-sm">Yes</label>
        </div>
        <div className="flex items-center">
          <input
            id="relatedNo"
            type="radio"
            name="isRelated"
            value="false"
            checked={!formData.isRelated}
            onChange={(e) => setFormData((prev) => ({ ...prev, isRelated: false }))}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor="relatedNo" className="ms-2 text-sm">No</label>
        </div>
      </div>
      {formData.isRelated && (
        <div>
          <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">
            Project
          </label>
          <select
            id="projectId"
            name="projectId"
            value={formData.projectId || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Ticket Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a category</option>
          <option value="Application">Application</option>
          <option value="Billing">Billing</option>
          <option value="Performance">Performance</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
          Subject Line
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter subject"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter description"
          required
        />
        <small>Fully describe your problem or request. Include affected environments, the URL of where you saw the problem, and the steps to reproduce it.</small>
      </div>
      <Button text="Create Ticket" type="submit" />
    </form>
  );
};

export default GeneralSupportForm;
