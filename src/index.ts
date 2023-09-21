import express, { Express } from 'express';
import http, { Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { initializeSocketEvents } from './controllers/gameController';
import { CONFIG } from './config';

const app: Express = express();
export const server: Server = http.createServer(app);
export const io: SocketIOServer = new SocketIOServer(server, {
    cors: {
        origin: CONFIG.ORIGIN,
        methods: ["GET", "POST"]
    }
});

initializeSocketEvents(io);

server.listen(CONFIG.PORT, () => {
    console.log(`Server running on port ${CONFIG.PORT}`);
});
