import socketIo from 'socket.io';
import { sendMessageToSocket, sendMessageToPlayer, sendTurnToPlayer, sendMessageToAll } from '../utils/socketUtils';
import { players, startGame, addPlayer, handlePlayerMove, resetGame, removePlayer } from './gameLogicService';
import { getNextPlayerIndex } from '../utils/gameUtils';

export function handleConnection(socket: socketIo.Socket) {
    const welcomeMessage = addPlayer(socket.id);
    if (welcomeMessage) sendMessageToSocket(socket, welcomeMessage);

    if (players.length === 2) {
        sendMessageToPlayer(players, 0, 'Player 2 has connected.');
        const { message: startMessage, currentNumber: startNumber } = startGame();
        sendMessageToAll(startMessage);
        sendTurnToPlayer(players, getNextPlayerIndex(-1), startNumber);
    }
}
export function handleMove(socket: socketIo.Socket) {
    const currentPlayerIndex = players.indexOf(socket.id);
    const moveResult = handlePlayerMove(socket.id);

    if (moveResult.playerMessage) {
        sendMessageToSocket(socket, moveResult.playerMessage);
    }

    if (moveResult.winnerId) {
        sendMessageToAll(`Player ${currentPlayerIndex + 1} wins!`);
        resetGame();
    } else {
        if (moveResult.message) {
            const nextPlayerIndex = getNextPlayerIndex(currentPlayerIndex);
            sendMessageToPlayer(players, nextPlayerIndex, moveResult.message);
            sendTurnToPlayer(players, nextPlayerIndex, moveResult.newNumber);
            sendMessageToPlayer(players, currentPlayerIndex, 'Waiting for the other player to move...');
        }
    }
}

export function handleDisconnect(socket: socketIo.Socket) {
    removePlayer(socket.id);
    if (players.length === 1) {
        sendMessageToPlayer(players, 0, 'The other player has disconnected. Game ended.');
        resetGame();
    }
}
