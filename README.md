# Messaging Application

## Description

This is a real-time messaging application built with Node.js for the server and React for the client. The application allows users to send and receive messages in real-time using WebSocket technology. Messages are stored in a MongoDB database, and the server is designed to handle message batching and ensure that no messages are lost during disconnections.

## Setup Instructions

### 1. Clone the Repository to your local machine

bash
git clone https://github.com/GayanePoghosyan/message-app-task.git
cd message-app

### 2. Set Up MongoDB localy (required replicas initialization) or Create a MongoDB Cloud Account**: If you don't have one, sign up for a MongoDB Cloud account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). Choose M10 version for cluser

### 3. Install Dependencies

Navigate to the `server` directory and install the server dependencies:

bash
cd server
npm install

Then, navigate to the `client` directory and install the client dependencies:

bash
cd ../client
npm install


### 4. Run the Application

#### Start the Server

Navigate back to the `server` directory and start the server:

bash
cd server
npm start


#### Start the Client

In a new terminal window, navigate to the `client` directory and start the React application:

bash
cd client
npm start

### 5. Access the Application

Open your web browser and navigate to `http://localhost:5173` to access the messaging application.

