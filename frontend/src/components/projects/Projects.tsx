import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../spinner/Spinner';
import Message from '../message/Message';
import { UserType } from '../../utils/types/UserType';
import ProjectDetails from './ProjectDetails';
import { formatDate } from '../../utils/formatDate';
import { CalendarIcon } from '@heroicons/react/24/solid'
import { ProjectType } from '../../utils/types/ProjectType';
import { verifyUser } from '../../utils/verifyUser';
import { useNavigate } from 'react-router-dom';

interface ProjectsProps {
  user: UserType | null | undefined;
}

const Projects: React.FC<ProjectsProps> = ({ user }) => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const fetchProjectsByClientId = async (clientId: number) => {
    let allProjects: ProjectType[] = [];
    let page = 1;
    const perPage = 100;
    let totalPages = 1;

    try {
      while (page <= totalPages) {
        const response = await axios.get('https://api.harvestapp.com/v2/projects', {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_HARVEST_ACCESS_TOKEN}`,
            'Harvest-Account-ID': process.env.REACT_APP_HARVEST_ACCOUNT_ID,
            'Content-Type': 'application/json',
          },
          params: {
            client_id: clientId,
            page: page,
            per_page: perPage,
          },
        });

        allProjects = allProjects.concat(response.data.projects);

        const totalRecords = response.data.total_entries;
        totalPages = Math.ceil(totalRecords / perPage);
        page += 1;
      }

      setProjects(allProjects);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const decodedToken = verifyUser(token);

    if (!decodedToken) {
      sessionStorage.removeItem('token');
      navigate('/');
    }

    if (user === undefined || user === null) return;

    fetchProjectsByClientId(user.clientId);
  }, [user]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Message message={error} type="error" />;
  }

  return (
    <div>
      <h1 className="text-3xl text-blue-900 mb-8">Projects</h1>
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div>
          {projects.map((project) => (
            <div key={project.id} className="mb-4">
              <div className="bg-blue-800 text-white p-4 rounded-tl-lg rounded-tr-lg">
                <h2>
                  [{project.code}] {project.name}
                  <span className="text-sm bg-white text-blue-800 rounded-lg px-2 py-1 ml-4">
                    {project.hourly_rate ? 'Time & Materials' : 'Fixed Fee'}
                  </span>
                </h2>
              </div>
              <div className="p-4 shadow-lg rounded-bl-lg rounded-br-lg">
                <p className="flex mb-4"><CalendarIcon className="size-6 text-blue-800 mr-2" /> {formatDate(project.starts_on)} - {formatDate(project.ends_on)}</p>
                {project.notes ? <p className="mb-4">{project.notes}</p> : null}
                <ProjectDetails user={user} projectId={project.id} />
                {project.fee ? <><p className="font-bold">Fixed Cost</p><p>${project.fee.toFixed(2)}</p></> : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
