# Chat Assistant Frontend

This is the frontend of a **chat assistant application** that connects to a Flask-based backend via **SocketIO** for real-time communication and provides session management features using **Redis**. The app allows users to interact with an assistant, view session history, and manage multiple chat sessions.

## Features

- **Real-Time Chat**: Communicate with the assistant in real-time using **SocketIO**.
- **Session Management**:
  - Create new chat sessions.
  - View the session history for any active session.
  - Delete sessions and clear associated history.
- **Responsive UI**: Designed with a sidebar for session management and a main area for chat interaction.
- **Message Handling**: Allows users to send messages and receive assistant responses.

## Technologies Used

- **React**: Frontend framework used to build the user interface.
- **SocketIO**: Used for real-time bidirectional event-based communication with the backend.
- **Axios**: Used to make HTTP requests to the backend for session management (fetching history and clearing sessions).
- **Tailwind CSS**: Used for styling the UI components (sidebar, chat area, and buttons).

## Setup

### Requirements

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd ./ai-rag-chatbot
   npm install
   npm start

   Note - Ensure the backend (Flask app with Redis) is running on http://localhost:5000 to interact with the chat assistant.
   ```

## Application Usage
### Creating a Session
On the left sidebar, click the Add New Session button to create a new chat session.

Each session will have a unique ID and can be selected to view or interact with its history.

### Interacting with the Assistant
Type your message in the input box at the bottom and click Send or press Enter.

The assistant's response will appear above the input box.

### Managing Sessions
View History: When a session is selected, the chat history (messages sent and received) will be fetched and displayed.

Delete Session: Click the Delete button next to a session to remove it from the list. This will also clear the session’s history on the backend.

### Real-Time Updates
The app uses SocketIO to listen for real-time responses from the assistant. When a message is sent, it will appear in the chat in real-time.

## Code Structure
App.js: Main React component that handles the UI and interactions.

App.css: Custom styling for the chat interface and session management sidebar.

SocketIO Integration: The app connects to the backend via socket.io-client to receive real-time updates.

Session Management: The app interacts with the backend through axios to fetch session history and delete sessions.

## Notes
Session Management: The app maintains a list of session IDs (session_12345 in the example) and allows users to switch between different sessions.

Message Handling: Messages from the user and assistant are handled with the message state and displayed in a scrollable chat area.

## Future Improvements
Enhance UI/UX with animations or transitions between sessions.

Implement user authentication for better session management.

Add error handling and loading states for network requests.

### Explanation of Sections:
- **Features**: Describes the core functionalities of the app, such as real-time chat, session management, and message handling.
- **Technologies Used**: Lists the libraries and frameworks used in the project, such as React, SocketIO, and Axios.
- **Setup**: Provides steps to install dependencies and run the project locally.
- **Application Usage**: Explains how users can interact with the frontend, create sessions, send messages, and manage chat sessions.
- **Code Structure**: Briefly describes the structure and main components of the code.
- **Notes**: Provides additional information on session management and message handling.
- **Future Improvements**: Mentions potential features to enhance the application.
- **License**: Adds the project's license information (MIT in this case).
