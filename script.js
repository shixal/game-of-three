const socket = io.connect('http://localhost:3000');

// DOM references to the game log and the "Play Turn" button.
const gameLog = document.getElementById('gameLog');
const playTurnButton = document.getElementById('playTurn');

playTurnButton.addEventListener('click', handlePlayTurn);

// Keep track of the current number in the game.
let currentNumber = null;

// Attach event listeners to the socket.
socket.on('message', addToGameLog);
socket.on('turn', handleNewTurn);
socket.on('win', handleGameWin);

//Handles the logic when the "Play Turn" button is clicked. Calculates the value to add, updates the log, and emits a move event.
function handlePlayTurn() {
    let addValue = calculateAddValue(currentNumber);
    let newValue = currentNumber + addValue;
    let newNumber = newValue / 3;
    addToGameLog(`You chose: ${addValue}.`);
    addToGameLog(`${currentNumber} ${addValue >= 0 ? '+' : ''} ${addValue} = ${newValue}`);
    addToGameLog(`${newValue} / ${3} = ${newNumber}`);
    socket.emit('move', newNumber);
    playTurnButton.disabled = true;
}

// Updates the game log when it's a player's turn and enables the "Play Turn" button.
function handleNewTurn(number) {
    currentNumber = number;
    addToGameLog(`Your turn. Current number: ${number}`);
    playTurnButton.disabled = false;
}

// Determines the game's outcome and informs the player.
function handleGameWin(winnerId) {
    addToGameLog(socket.id === winnerId ? 'You win!' : 'You lose!');
}

// Calculates the value to add to the current number to make it divisible by 3 using modulo.
function calculateAddValue(number) {
    for (let value = -1; value <= 1; value++) {
        if ((number + value) % 3 === 0) {
            return value;
        }
    }
    return 0;
}

// Adds a message to the game log.
function addToGameLog(message, highlight = false) {
    const now = new Date();
    const timestamp = now.toLocaleTimeString();

    const logEntry = document.createElement('div');
    logEntry.classList.add('message');

    const timeSpan = document.createElement('span');
    timeSpan.classList.add('timestamp');
    timeSpan.textContent = timestamp;

    logEntry.appendChild(timeSpan);
    logEntry.appendChild(document.createTextNode(` - ${message}`));

    if (highlight) {
        logEntry.classList.add('highlight');
    }

    gameLog.appendChild(logEntry);
    gameLog.scrollTop = gameLog.scrollHeight;
}
