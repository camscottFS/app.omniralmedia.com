import React, { useRef } from 'react';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  setModalOpen: (open: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({ title, children, setModalOpen }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setModalOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleBackdropClick}
    >
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h2 className="text-lg text-blue-900 font-semibold mb-4">
          {title}
        </h2>
        <div>
          {children}
        </div>
        <div>
          <button
            className="mt-4 w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
