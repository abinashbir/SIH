import React, { useState } from 'react';
import answers from './catbot-answers.json';

const defaultReplies = [
  "I'm sorry, I do not have an answer for that.",
  "Could you please rephrase your question?",
  "Thank you for your inquiry. I will get back to you soon.",
  "I'm here to assist you with your questions.",
  "Please provide more details for a precise answer.",
];

function getCatReply(userInput) {
  const normalizedInput = userInput.trim().toLowerCase();
  const found = answers.find(
    item => item.question && item.question.trim().toLowerCase() === normalizedInput
  );
  return found ? found.answer : defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
}

export default function CatBot() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hello. I am your assistant. How may I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      setMessages(msgs => [
        ...msgs,
        { sender: 'bot', text: getCatReply(input) }
      ]);
    }, 1200); // 1.2 seconds "thinking" time
    setInput('');
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1001,
            background: '#243375',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            fontSize: '28px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            cursor: 'pointer'
          }}
          aria-label="Open chat bot"
        >
          💬
        </button>
      )}
      {open && (
        <div style={{
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          borderRadius: '12px',
          width: '340px',
          padding: '0',
          background: '#f8f9fa',
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          fontFamily: 'Segoe UI, Arial, sans-serif',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '8px 8px 0 0'
          }}>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '22px',
                cursor: 'pointer',
                color: '#243375'
              }}
              aria-label="Close chat bot"
            >
              ✖
            </button>
          </div>
          <div style={{
            maxHeight: '260px',
            overflowY: 'auto',
            padding: '16px',
            background: '#f8f9fa',
            borderBottom: '1px solid #e0e0e0'
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.sender === 'bot' ? 'flex-start' : 'flex-end',
                marginBottom: '10px'
              }}>
                <div style={{
                  background: msg.sender === 'bot' ? '#e3e7f1' : '#243375',
                  color: msg.sender === 'bot' ? '#243375' : '#fff',
                  padding: '10px 14px',
                  borderRadius: '18px',
                  maxWidth: '80%',
                  fontSize: '15px',
                  boxShadow: '0 2px 8px rgba(36,51,117,0.04)'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '10px'
              }}>
                <div style={{
                  background: '#e3e7f1',
                  color: '#243375',
                  padding: '10px 14px',
                  borderRadius: '18px',
                  maxWidth: '80%',
                  fontSize: '15px',
                  boxShadow: '0 2px 8px rgba(36,51,117,0.04)',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span className="typing-dots" style={{
                    display: 'inline-block',
                    width: '24px',
                    textAlign: 'left'
                  }}>
                    <span style={{
                      animation: 'blink 1s infinite'
                    }}>•</span>
                    <span style={{
                      animation: 'blink 1s infinite 0.2s'
                    }}>•</span>
                    <span style={{
                      animation: 'blink 1s infinite 0.4s'
                    }}>•</span>
                  </span>
                </div>
              </div>
            )}
            <style>
              {`
                @keyframes blink {
                  0% { opacity: 0.2; }
                  20% { opacity: 1; }
                  100% { opacity: 0.2; }
                }
                .typing-dots span {
                  font-size: 22px;
                  margin-right: 2px;
                }
              `}
            </style>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            background: '#fff',
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px'
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                fontSize: '15px',
                marginRight: '8px'
              }}
              disabled={typing}
            />
            <button
              onClick={sendMessage}
              style={{
                background: '#243375',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 18px',
                fontWeight: 'bold',
                cursor: typing ? 'not-allowed' : 'pointer',
                fontSize: '15px'
              }}
              disabled={typing}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}