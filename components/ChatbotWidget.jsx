import React from 'react';
import './ChatbotWidget.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';

const ChatbotWidget = ({ onToggle }) => {
  return (
    <div
      className="chatbot-widget"
      onClick={onToggle}
      title="Chat with Assistant"
    >
      <FontAwesomeIcon icon={faCommentDots} size="2x" />
    </div>
  );
};

export default ChatbotWidget;
