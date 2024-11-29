import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Message from '../message/Message';
import { UserType } from '../../utils/types/UserType';
import BarLoading from '../loading/BarLoading';
import ProjectProgressChart from './ProjectProgressChart';
import HoursPerWeekChart from './HoursPerWeekChart';
import { getWeekNumber } from '../../utils/getWeekNumber';
import { ChartBarIcon, ClockIcon } from '@heroicons/react/24/solid';

interface ProjectDetailsProps {
  user: UserType | null | undefined;
  projectId: number;
}

interface TimeEntry {
  id: number;
  hours: number;
  billable: boolean;
  billable_rate: number | null;
  is_billed: boolean;
  task: {
    id: number;
    name: string;
  };
}

interface TaskSummary {
  taskId: number;
  taskName: string;
  hours: number;
  billableAmount: number;
  costs: number;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ user, projectId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalHours, setTotalHours] = useState(0);
  const [billableHours, setBillableHours] = useState(0);
  const [nonBillableHours, setNonBillableHours] = useState(0);
  const [uninvoicedAmount, setUninvoicedAmount] = useState(0);
  const [taskSummaries, setTaskSummaries] = useState<TaskSummary[]>([]);
  const [progressData, setProgressData] = useState<{ date: string; hours: number }[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ week: string; hours: number }[]>([]);
  const [chartSelection, setChartSelection] = useState('progress');

  useEffect(() => {
    if (user === undefined) return;

    if (!user || user.clientId === null || user.clientId === undefined) {
      setError('Client ID not found. Unable to fetch project details.');
      setLoading(false);
      return;
    }

    const fetchProjectDetails = async () => {
      try {
        let allTimeEntries: TimeEntry[] = [];
        let page = 1;
        const perPage = 100;
        let totalPages = 1;

        // Fetch time entries for the project
        while (page <= totalPages) {
          const response = await axios.get('https://api.harvestapp.com/v2/time_entries', {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_HARVEST_ACCESS_TOKEN}`,
              'Harvest-Account-ID': process.env.REACT_APP_HARVEST_ACCOUNT_ID,
              'Content-Type': 'application/json',
            },
            params: {
              project_id: projectId,
              page: page,
              per_page: perPage,
            },
          });

          allTimeEntries = allTimeEntries.concat(response.data.time_entries);

          const totalRecords = response.data.total_entries;
          totalPages = Math.ceil(totalRecords / perPage);
          page += 1;
        }

        // Aggregate the data
        let totalHours = 0;
        let billableHours = 0;
        let nonBillableHours = 0;
        let uninvoicedAmount = 0;
        const taskMap: { [key: string]: TaskSummary } = {};
        const progressMap: { [date: string]: number } = {};
        const weeklyMap: { [week: string]: number } = {};

        allTimeEntries.forEach((entry: any) => {
          totalHours += entry.hours;
          if (entry.billable) {
            billableHours += entry.hours;
            if (!entry.is_billed) {
              const rate = entry.billable_rate || 0;
              uninvoicedAmount += rate * entry.hours;
            }
          } else {
            nonBillableHours += entry.hours;
          }

          const taskId = entry.task.id;
          if (!taskMap[taskId]) {
            taskMap[taskId] = {
              taskId: entry.task.id,
              taskName: entry.task.name,
              hours: 0,
              billableAmount: 0,
              costs: 0, // If cost data is available
            };
          }

          taskMap[taskId].hours += entry.hours;
          if (entry.billable) {
            const rate = entry.billable_rate || 0;
            taskMap[taskId].billableAmount += rate * entry.hours;
          }

          // Update progress data
          const date = entry.created_at.split('T')[0]; // Extract the date
          progressMap[date] = (progressMap[date] || 0) + entry.hours;

          // Update weekly data
          const week = `Week ${getWeekNumber(new Date(entry.created_at))}`;
          weeklyMap[week] = (weeklyMap[week] || 0) + entry.hours;
        });

        const taskSummaries = Object.values(taskMap);
        const progressData = Object.entries(progressMap).map(([date, hours]) => ({ date, hours }));
        const weeklyData = Object.entries(weeklyMap).map(([week, hours]) => ({ week, hours }));

        // Update state
        setTotalHours(totalHours);
        setBillableHours(billableHours);
        setNonBillableHours(nonBillableHours);
        setUninvoicedAmount(uninvoicedAmount);
        setTaskSummaries(taskSummaries);
        setProgressData(progressData);
        setWeeklyData(weeklyData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError('Failed to fetch project details.');
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [user, projectId]);

  if (loading) return <BarLoading />;

  if (error) {
    return <Message message={error} type="error" />;
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div>
          <h2 className="text-md font-bold">Total Hours</h2>
          <p>{totalHours.toFixed(2)}</p>
        </div>
        <div>
          <h2 className="text-md font-bold">Billable</h2>
          <p>{billableHours.toFixed(2)}</p>
        </div>
        <div>
          <h2 className="text-md font-bold">Non-billable</h2>
          <p>{nonBillableHours.toFixed(2)}</p>
        </div>
        <div>
          <h2 className="text-md font-bold">Uninvoiced Amount</h2>
          <p>${uninvoicedAmount.toFixed(2)}</p>
        </div>
      </div>
      <div className="mb-8">
        <div className="flex border rounded-md overflow-hidden w-max mb-4">
          <button
            className={`flex items-center px-4 py-2 border-r text-sm font-medium ${chartSelection === 'progress'
              ? 'bg-blue-50 text-black'
              : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100'
              }`}
            onClick={() => setChartSelection('progress')}
          >
            <span className="mr-2"><ChartBarIcon className="h-4 text-blue-800" /></span> Project progress
          </button>
          <button
            className={`flex items-center px-4 py-2 text-sm font-medium ${chartSelection === 'hours'
              ? 'bg-blue-50 text-black'
              : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100'
              }`}
            onClick={() => setChartSelection('hours')}
          >
            <span className="mr-2"><ClockIcon className="h-4 text-blue-800" /></span> Hours per week
          </button>
        </div>
        {chartSelection === 'progress' ? (
          <ProjectProgressChart progressData={progressData} />
        ) : (
          <HoursPerWeekChart weeklyData={weeklyData} />
        )}
        <div className="mt-8">
          <table className="table-auto w-full">
            <thead className="text-left">
              <tr>
                <th className="w-1/4">Billable Tasks</th>
                <th className="w-1/4">Hours</th>
                <th className="w-1/4 text-right">Billable Amount</th>
                <th className="w-1/4 text-right">Costs</th>
              </tr>
            </thead>
            <tbody>
              {taskSummaries.map((task) => (
                <tr key={task.taskId}>
                  <td>{task.taskName}</td>
                  <td>{task.hours.toFixed(2)}</td>
                  <td className="text-right">${task.billableAmount.toFixed(2)}</td>
                  <td className="text-right">${task.costs.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td>Total</td>
                <td>{totalHours.toFixed(2)}</td>
                <td className="text-right">
                  $
                  {taskSummaries
                    .reduce((sum, t) => sum + t.billableAmount, 0)
                    .toFixed(2)}
                </td>
                <td className="text-right">
                  $
                  {taskSummaries
                    .reduce((sum, t) => sum + t.costs, 0)
                    .toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
