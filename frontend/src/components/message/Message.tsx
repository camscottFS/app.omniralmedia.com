import React from 'react';

interface MessageProps {
  type: 'success' | 'error';
  message: string;
}

const Message: React.FC<MessageProps> = ({ type, message }) => {
  return (
    <>
      {type === 'success' ? (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-4"
          role="alert"
        >
          <p>{message}</p>
        </div>
      ) : type === 'error' ? (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4"
          role="alert"
        >
          <p>{message}</p>
        </div>
      ) : null}
    </>
  );
};

export default Message;
