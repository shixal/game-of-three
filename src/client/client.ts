import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');
const gameLog: HTMLElement | null = document.getElementById('gameLog');
const playTurnButton = document.getElementById('playTurn') as HTMLButtonElement | null;

// If there's a playTurnButton, attach an event listener.
playTurnButton?.addEventListener('click', handlePlayTurn);

// Attach event listeners to the socket.
socket.on('message', addToGameLog);
socket.on('turn', handleNewTurn);
socket.on('win', handleGameWin);


function handlePlayTurn(): void {
    socket.emit('move');
    playTurnButton!.disabled = true;
}

function handleNewTurn(number: number): void {
    addToGameLog(`Your turn. Current number: ${number}`);
    playTurnButton!.disabled = false;
}

function handleGameWin(winnerId: string): void {
    addToGameLog(socket.id === winnerId ? 'You win!' : 'You lose!');
}

function addToGameLog(message: string, highlight: boolean = false): void {
    if (gameLog) {
        const timestamp = new Date().toLocaleTimeString();

        const logEntry = document.createElement('div');
        logEntry.className = `message ${highlight ? 'highlight' : ''}`;
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'timestamp';
        timeSpan.textContent = timestamp;
        
        logEntry.append(timeSpan, ` - ${message}`);
        
        gameLog.append(logEntry);
        gameLog.scrollTop = gameLog.scrollHeight;
    }
}
