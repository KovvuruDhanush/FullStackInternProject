const express = require('express');
const http = require('http');

const app = require('./app');
const WebSocketService = require('./services/websocketService');

const port = process.env.PORT || 5002;
const server = http.createServer(app);

// Initialize WebSocket service
const wsService = new WebSocketService(server);

// Make wsService available globally
global.wsService = wsService;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});