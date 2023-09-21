import socketIo from 'socket.io';
import * as gameService from '../services/gameLogicService';
import * as socketHandler from '../services/socketHandlersService';

export function initializeSocketEvents(io: socketIo.Server) {
    io.on('connection', (socket: socketIo.Socket) => {
        socketHandler.handleConnection(socket);
        socket.on('move', (newNumber: number) => socketHandler.handleMove(socket));
        socket.on('disconnect', () => socketHandler.handleDisconnect(socket));
    });
}
