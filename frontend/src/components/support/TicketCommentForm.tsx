import React from 'react'
import Button from '../button/Button';

const TicketCommentForm: React.FC = () => {
  return (
    <div className="mb-8">
      <textarea
        id="emailInput"
        className="w-full px-4 py-2 mt-1 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        // value={emailInput}
        // onChange={(e) => setEmailInput(e.target.value)}
        required
      />
      <Button type="submit" text="Send message" />
    </div>
  )
}

export default TicketCommentForm;