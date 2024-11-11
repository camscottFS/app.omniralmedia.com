import React from 'react'
import Button from '../button/Button'
import { ProjectType } from '../../utils/types/ProjectType';
import AnchorLink from '../anchorLink/AnchorLink';

interface FeatureSupportFormProps {
  projects: any;
}

const FeatureSupportForm: React.FC<FeatureSupportFormProps> = ({ projects }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { return null }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <AnchorLink to="/support" text="Go back" />
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
        <small>Fully describe your feature request.</small>
      </div>
      <Button text="Create Ticket" type="submit" />
    </form>
  )
}

export default FeatureSupportForm;