// Import required modules
const express = require("express");
const http = require('http');
const socketio = require("socket.io");
const path = require("path");
const cors = require('cors');

// Initialize express and apply CORS middleware
const app = express();
app.use(cors());

// Create HTTP server and initialize Socket.io
const server = http.createServer(app);
const io = socketio(server);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "../public")));

// Listen for WebSocket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  // Handle incoming messages and broadcast them to all clients
  socket.on('send_message', (data) => {
    io.sockets.emit('receive_message', {
      sender_id: data.sender_id,
      receiver_id: data.receiver_id,
      message: data.message,
      user_type: data.user_type
    });
  });
});

// Define a basic GET route
app.get('/', (req, res) => {
  res.send('Hello world');
});

// Set up the server to listen on a port
const PORT = process.env.PORT || 8998;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
