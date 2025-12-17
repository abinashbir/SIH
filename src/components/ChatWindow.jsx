// src/components/ChatWindow.jsx

import React from 'react';
import './ChatWindow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

// A simple hook to manage chat state
const useChat = () => {
  const [messages, setMessages] = React.useState([
    { text: "Hello! How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = React.useState('');

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    // Add user's message
    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');

    // Simulate a bot response after 1 second
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "I am a simple bot. How can I assist you further?", sender: 'bot' }]);
    }, 1000);
  };

  return { messages, input, setInput, handleSendMessage };
};

const ChatWindow = ({ onClose }) => {
  const { messages, input, setInput, handleSendMessage } = useChat();
  const messagesEndRef = React.useRef(null);

  // Auto-scroll to the latest message
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>Chat Assistant</h3>
        <button onClick={onClose} className="close-btn" aria-label="Close chat">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSendMessage} className="send-btn" aria-label="Send message">
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;