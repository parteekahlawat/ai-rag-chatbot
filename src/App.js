import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import io from 'socket.io-client';
import axios from 'axios';
// Connect to the backend
const socket = io('http://localhost:5000');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState('session_12345'); 
  const [sessions, setSessions] = useState(['session_12345']); 
  const [activeSessionId, setActiveSessionId] = useState('session_12345'); 
  const messageInputRef = useRef(null);

  // Fetch existing sessions on component mount
  useEffect(() => {
    setSessions([{ id: 'session_12345', name: 'Session 1' }]);

    socket.on('response', (data) => {
      setMessages((prevMessages) => [...prevMessages, { sender: 'assistant', message: data.message }]);
    });

    return () => {
      socket.off('response');
    };
  }, []);

  useEffect(() => {
    const fetchSessionHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/history/${activeSessionId}`,{
          headers: {
            'Accept': 'application/json', 
          },}
        );
        const history = response.data.history.map((entry) => {

          let validJsonString = entry.replace(/'/g, '"'); 
          validJsonString = validJsonString.replace(/\\"/g, '"');
          validJsonString = validJsonString.replace(/\\'/g, "'"); 

          try {
            return JSON.parse(validJsonString); 
          } catch (error) {
            console.error("Error parsing JSON", error);
            return entry; 
          }
        });
        console.log(history); 
        setMessages(history)
      } catch (error) {
        console.error('Error fetching session history:', error);
      }
    };

    if (activeSessionId) {
      fetchSessionHistory();
    }
  }, [activeSessionId]);

  // Function to send message to backend
  const sendMessage = () => {
    if (message.trim()) {
      setMessages((prevMessages) => [...prevMessages, { sender: 'user', message }]);
      socket.emit('message', { session_id: sessionId, message });
      setMessage(''); // Clear the input
      messageInputRef.current.focus();
      console.log(messages) // Focus back to the input field
    }
  };

  // Function to handle keypress (Enter key)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Function to add a new session
  const addSession = async () => {
    const newSessionId = `session_${Date.now()}`; // Generate a unique session ID
    const newSession = { id: newSessionId, name: `Session ${sessions.length + 1}` };

    setSessions((prevSessions) => [...prevSessions, newSession]);
  };

  const deleteSession = async (sessionIdToDelete) => {
    try {
      // Make the API call to delete the session on the backend
      try {
        console.log(sessionIdToDelete)
        const response = await axios.get(
          `http://localhost:5000/clear_session/${sessionIdToDelete}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        // Handle the response, for example:
        console.log('Session deleted successfully:', response.data);
      } catch (error) {
        console.error('Error deleting session:', error);
      }
      if (1) {
        setSessions(sessions.filter((session) => session.id !== sessionIdToDelete));
        if (sessionIdToDelete === activeSessionId) {
          setActiveSessionId('');
          setSessionId('');
        }
      } else {
        console.error('Failed to delete session');
      }
    } catch (error) {
      console.error('Failed to delete session', error);
    }
  };

  const handleSessionClick = (sessionId) => {
    setActiveSessionId(sessionId);
    setSessionId(sessionId); 
  };

  return (
    <div className="App flex">
      {/* Sidebar */}
      <div className="sidebar w-1/4 bg-gray-100 p-4 border-r border-gray-300">
        <h2 className="text-lg font-semibold mb-4">Active Sessions</h2>
        <button
          onClick={addSession}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Add New Session
        </button>
        <ul>
          {sessions.map((session) => (
            <li
              key={session.id}
              className={`mb-2 flex justify-between items-center p-2 rounded-md cursor-pointer ${activeSessionId === session.id ? 'bg-blue-300' : 'hover:bg-gray-200'
                }`}
              onClick={() => handleSessionClick(session.id)}
              style={{
                color: activeSessionId === session.id ? 'red' : 'green', 
              }}
            >
              <span className="text-sm ">{session.name} ({session.id})</span>
              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  deleteSession(session.id);
                }}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Area */}
      <div className="chat-container w-3/4 p-4">
        <h1 className="text-xl font-bold mb-4">Chat with Assistant</h1>
        <div className="chat-box bg-white p-4 border border-gray-300 rounded-md mb-4 h-72 overflow-auto">
          {messages.map((msg, index) => (
            <div key={index} className={msg.sender === 'user' ? 'user-message' : 'assistant-message'}>
              <strong>{msg.sender === 'user' ? 'You: ' : 'Assistant: '}</strong>{msg.message}
            </div>
          ))}
        </div>
        <div className="message-input flex">
          <input
            ref={messageInputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="flex-1 p-2 border border-gray-300 rounded-md mr-2"
          />
          <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
