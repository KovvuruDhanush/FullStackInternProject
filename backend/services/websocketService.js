const WebSocket = require('ws');

class WebSocketService {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.clients = new Set();
        this.setupWebSocket();
    }

    setupWebSocket() {
        this.wss.on('connection', (ws) => {
            this.clients.add(ws);

            ws.on('close', () => {
                this.clients.delete(ws);
            });

            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
            });
        });
    }

    broadcastRatingUpdate(data) {
        const message = JSON.stringify({
            type: 'RATING_UPDATE',
            data
        });

        this.broadcast(message);
    }

    broadcastStoreUpdate(data) {
        const message = JSON.stringify({
            type: 'STORE_UPDATE',
            data
        });

        this.broadcast(message);
    }

    broadcast(message) {
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
}

module.exports = WebSocketService;