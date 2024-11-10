import React from 'react'
import Button from '../button/Button'
import { ProjectType } from '../../utils/types/ProjectType';

interface GeneralSupportFormProps {
  projects: any;
}

const GeneralSupportForm: React.FC<GeneralSupportFormProps> = ({ projects }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { return null }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
          Is this issue related to a project within your workspace?
        </label>
        <div className="flex items-center mb-2">
          <input id="relatedYes" type="radio" value={1} name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          <label htmlFor="relatedYes" className="ms-2 text-sm">Yes</label>
        </div>
        <div className="flex items-center">
          <input checked id="relatedNo" type="radio" value={0} name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          <label htmlFor="relatedNo" className="ms-2 text-sm">No</label>
        </div>
      </div>
      <div>
        <label htmlFor="project" className="block text-sm font-medium text-gray-700">
          Project
        </label>
        <select
          id="project"
          className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        // value={roleId}
        // onChange={(e) => setRoleId(e.target.value)}
        >
          <option value={0}>Select a project</option>
          {projects.map((project: ProjectType) => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="ticketCategory" className="block text-sm font-medium text-gray-700">
          Ticket Category
        </label>
        <select
          id="ticketCategory"
          className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        // value={roleId}
        // onChange={(e) => setRoleId(e.target.value)}
        >
          <option value={0}>Select a category</option>
          <option value={0}>Application</option>
          <option value={0}>Billing</option>
          <option value={0}>Performance</option>
          <option value={0}>Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="subjectLine" className="block text-sm font-medium text-gray-700">
          Subject Line
        </label>
        <input
          type="text"
          id="subjectLine"
          className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter subject"
          // value={username}
          // onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="emailInput" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="emailInput"
          className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter description"
          // value={emailInput}
          // onChange={(e) => setEmailInput(e.target.value)}
          required
        />
        <small>Fully describe your problem or request. Include affected environments, the URL of where you saw the problem, and the steps to reproduce it.</small>
      </div>
      <Button text="Create Ticket" type="submit" />
    </form>
  )
}

export default GeneralSupportForm;