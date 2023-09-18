const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const PORT = 3000;
const ORIGIN = "*";

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ORIGIN,
        methods: ["GET", "POST"]
    }
});

let players = [];
let currentPlayer = null;
let currentNumber = null;


/**
 * When a new player tries to connect, check if there's room.
 * If so, add them to the players list.
 * If two players are connected, notify Player 1 about Player 2 and start the game.
 * If the room is full (2 players already connected), inform the connecting client.
*/
io.on('connection', (socket) => {
    if (players.length < 2) {
        players.push(socket.id);
        sendMessageToSocket(socket, `You are Player ${players.length}`);

        if (players.length === 2) {
            sendMessageToPlayer(0, 'Player 2 has connected.');
            startGame();
        }
    } else {
        sendMessageToSocket(socket, 'Room is full.');
    }
    
    socket.on('move', handleMove);
    socket.on('disconnect', handleDisconnect);
});

// Handles a player's move, checking validity and informing the other player about the move.
function handleMove(newNumber) {
    const index = players.indexOf(this.id);
    if (index === -1 || this.id !== currentPlayer) return; 

    const addValue = (newNumber * 3) - currentNumber;
    const nextPlayerIndex = getNextPlayerIndex(index);
    sendMessageToPlayer(nextPlayerIndex, `Player ${index + 1} added ${addValue} to make it divisible by 3 and then divided. Result: ${newNumber}`);
    
    currentNumber = newNumber;
    currentPlayer = players[nextPlayerIndex];
        
    if (newNumber === 1) {
        io.emit('win', this.id);
        resetGame();
    } else {
        sendTurnToPlayer(nextPlayerIndex, newNumber);
        sendMessageToPlayer(index, 'Waiting for the other player to move...');
    }
}

// Handles the disconnection of a player, notifying the other player and resetting game state if needed.
function handleDisconnect() {
    const index = players.indexOf(this.id);
    if (index !== -1) {
        players.splice(index, 1);
        const otherPlayerIndex = (index + 1) % 2;
        sendMessageToPlayer(otherPlayerIndex, 'The other player has disconnected. Game ended.');
        resetGame();
    }
}

// Initiates a new game by selecting a random player and a starting number.
function startGame() {
    const starterIndex = Math.floor(Math.random() * players.length);
    currentPlayer = players[starterIndex];
    currentNumber = Math.floor(Math.random() * 100) + 1; 
    sendMessageToAll(`Game started! Starting number: ${currentNumber}`);
    sendTurnToPlayer(starterIndex, currentNumber);
    const nextPlayerIndex = getNextPlayerIndex(starterIndex);
    sendMessageToPlayer(nextPlayerIndex, 'Waiting for the other player to move...');
}

// Resets the game state to its initial values.
function resetGame() {
    players = [];
    currentPlayer = null;
}

// Returns the index of the next player in line.
function getNextPlayerIndex(currentIndex) {
    return (currentIndex + 1) % 2;
}

// Sends a message directly to a specific socket.
function sendMessageToSocket(socket, message) {
    socket.emit('message', message);
}

// Sends a message to a specific player by index. 
function sendMessageToPlayer(index, message) {
    io.to(players[index]).emit('message', message);
}

// Broadcasts a message to all connected players.
function sendMessageToAll(message) {
    io.emit('message', message);
}

// Sends a turn notification to a specific player, notifying them it's their turn to move.
function sendTurnToPlayer(index, number) {
    io.to(players[index]).emit('turn', number);
}

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

