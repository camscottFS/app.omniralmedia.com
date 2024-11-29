import React, { useState } from 'react';
import axios from 'axios';
import Button from '../button/Button';
import { UserType } from '../../utils/types/UserType';
import Message from '../message/Message';

interface TicketCommentFormProps {
  userId: number;
  ticketId: number;
  onCommentAdded: () => void;
}

const TicketCommentForm: React.FC<TicketCommentFormProps> = ({ userId, ticketId, onCommentAdded }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (comment.trim() === '') {
      setError('Comment cannot be empty.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = sessionStorage.getItem('token');

      await axios.post(
        `${process.env.REACT_APP_API_HOST}/support/tickets/${ticketId}/comments`,
        { userId, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComment('');
      onCommentAdded();
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('An error occured, failed to add comment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      {error && <Message type="error" message={error} />}
      <form onSubmit={handleSubmit}>
        <textarea
          id="commentInput"
          className="w-full px-4 py-2 mt-1 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment here..."
          required
        />
        <Button type="submit" text="Send message" disabled={loading} />
      </form>
    </div>
  );
};

export default TicketCommentForm;
