import socketIo from 'socket.io';
import { io } from '../index';

export function sendMessageToSocket(socket: socketIo.Socket, message: string) {
    socket.emit('message', message);
}

export function sendMessageToPlayer(players: string[], index: number, message: string) {
    io.to(players[index]).emit('message', message);
}

export function sendMessageToAll(message: string) {
    io.emit('message', message);
}

export function sendTurnToPlayer(players: string[], index: number, number: number) {
    io.to(players[index]).emit('turn', number);
}
