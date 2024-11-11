import React from 'react'

interface AnchorLinkProps {
  to: string;
  text: string;
  blank?: boolean;
  icon?: React.ReactNode;
}

const AnchorLink: React.FC<AnchorLinkProps> = ({ to, text, blank, icon }) => {
  return (
    <a
      href={to}
      className={`${icon ? 'flex items-center' : null} text-gray-700 hover:text-blue-900 transition-colors`}
      target={blank ? '_blank' : '_self'}
      rel="noreferrer"
    >
      {icon && <span className="me-2">{icon}</span>}
      {text}
    </a>
  )
}

export default AnchorLink;