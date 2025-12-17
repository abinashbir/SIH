import React from 'react';
import './ChatbotWidget.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// UPDATED: Changed to a friendly chat bubble icon
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';

const ChatbotWidget = ({ onToggle }) => {
  return (
    <div className="chatbot-widget" onClick={onToggle} title="Chat with Assistant">
      {/* UPDATED: Changed the icon prop here */}
      <FontAwesomeIcon icon={faCommentDots} size="2x" />
    </div>
  );
};

export default ChatbotWidget;