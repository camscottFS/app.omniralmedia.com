import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../spinner/Spinner';
import Message from '../message/Message';
import { UserType } from '../../utils/types/UserType';

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

      allTimeEntries.forEach((entry) => {
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
        // Include costs if available
        // taskMap[taskId].costs += entry.cost_rate ? entry.cost_rate * entry.hours : 0;
      });

      const taskSummaries = Object.values(taskMap);

      // Update state
      setTotalHours(totalHours);
      setBillableHours(billableHours);
      setNonBillableHours(nonBillableHours);
      setUninvoicedAmount(uninvoicedAmount);
      setTaskSummaries(taskSummaries);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching project details:', err);
      setError('Failed to fetch project details.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user === undefined) return;

    if (!user || user.clientId === null || user.clientId === undefined) {
      setError('Client ID not found. Unable to fetch project details.');
      setLoading(false);
      return;
    }

    fetchProjectDetails();
  }, [user]);

  if (loading) return null;

  if (error) {
    return <Message message={error} type="error" />;
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div>
          <h2 className="text-lg font-bold">Total Hours</h2>
          <p>{totalHours.toFixed(2)}</p>
        </div>
        <div>
          <h2 className="text-lg font-bold">Billable</h2>
          <p>{billableHours.toFixed(2)}</p>
        </div>
        <div>
          <h2 className="text-lg font-bold">Non-billable</h2>
          <p>{nonBillableHours.toFixed(2)}</p>
        </div>
        <div>
          <h2 className="text-lg font-bold">Uninvoiced Amount</h2>
          <p>${uninvoicedAmount.toFixed(2)}</p>
        </div>
      </div>
      <div className="mb-8">
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
            {/* Total Row */}
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
  );
};

export default ProjectDetails;
