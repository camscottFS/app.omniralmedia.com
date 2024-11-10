import React, { useEffect, useState } from 'react';
import { UserType } from '../../utils/types/UserType';
import { useNavigate, useParams } from 'react-router-dom';
import NotFound from '../notFound/NotFound';
import { ProjectType } from '../../utils/types/ProjectType';
import Spinner from '../spinner/Spinner';
import Message from '../message/Message';
import axios from 'axios';
import Button from '../button/Button';
import GeneralSupportForm from './GeneralSupportForm';
import EmergencySupportForm from './EmergencySupportForm';
import FeatureSupportForm from './FeatureSupportForm';

interface TicketCreateProps {
  user: UserType | null | undefined;
}

const TicketCreate: React.FC<TicketCreateProps> = ({ user }) => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const type = useParams().type;
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
    if (user === undefined) return;

    if (!user || user.clientId === null || user.clientId === undefined) {
      console.log(user);
      setError('Client ID not found. Unable to fetch projects.');
      setLoading(false);
      return;
    }

    fetchProjectsByClientId(user.clientId);
  }, [user]);

  const handleSubmit = () => { return null };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Message message={error} type="error" />;
  }

  if (type !== 'general' && type !== 'emergency' && type !== 'feature') return <NotFound />;

  return (
    <div>
      {type === 'general' && (
        <>
          <h1 className="text-3xl text-blue-900 mb-8">Open general support ticket</h1>
          <div className="lg:w-1/2 md:w-full">
            <GeneralSupportForm projects={projects} />
          </div>
        </>
      )}
      {type === 'emergency' && (
        <>
          <h1 className="text-3xl text-blue-900 mb-8">Open emergency support ticket</h1>
          <div className="lg:w-1/2 md:w-full">
            <EmergencySupportForm projects={projects} />
          </div>
        </>
      )}
      {type === 'feature' && (
        <>
          <h1 className="text-3xl text-blue-900 mb-8">Open feature request ticket</h1>
          <div className="lg:w-1/2 md:w-full">
            <FeatureSupportForm projects={projects} />
          </div>
        </>
      )}
    </div>
  )
}

export default TicketCreate;