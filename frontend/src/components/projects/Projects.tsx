import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../spinner/Spinner';
import Message from '../message/Message';
import { UserType } from '../../utils/types/UserType';
import ProjectDetails from './ProjectDetails';

interface ProjectsProps {
  user: UserType | null | undefined;
}

interface Project {
  id: number;
  name: string;
  code: string | null;
  is_active: boolean;
  client: {
    id: number;
    name: string;
  };
  // Add other project properties as needed
}

const Projects: React.FC<ProjectsProps> = ({ user }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjectsByClientId = async (clientId: number) => {
    let allProjects: Project[] = [];
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
    if (user === undefined) return;

    if (!user || user.clientId === null || user.clientId === undefined) {
      console.log(user);
      setError('Client ID not found. Unable to fetch projects.');
      setLoading(false);
      return;
    }

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
      <h1 className="text-3xl mb-8">Projects</h1>
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div>
          {projects.map((project) => (
            <div key={project.id} className="mb-4">
              <div className="bg-blue-800 text-white p-4 rounded-tl-lg rounded-tr-lg">
                <h2>[{project.code}] {project.name}</h2>
              </div>
              <div className="p-4 shadow-lg rounded-bl-lg rounded-br-lg">
                <ProjectDetails user={user} projectId={project.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
