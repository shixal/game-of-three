import { GAME_CONFIG } from '../config';
import { generateStartingNumber, getNextPlayerIndex, calculateAddValue } from '../utils/gameUtils';
export let players: string[] = [];
let currentPlayer: string | null = null;
let currentNumber: number | null = null;

export function getPlayers(): string[] {
    return [...players];
}

function isRoomAvailable(): boolean {
    return players.length < GAME_CONFIG.MAX_PLAYERS;
}

export function startGame() {
    const starterIndex = Math.floor(Math.random() * players.length);
    currentPlayer = players[starterIndex];
    currentNumber = generateStartingNumber();
    
    return {
        message: `Game started! Starting number: ${currentNumber}`,
        currentNumber
    };
}

export function playTurn(currentNumber: number): { addValue: number, newValue: number, newNumber: number } {
    const addValue = calculateAddValue(currentNumber);
    const newValue = currentNumber + addValue;
    const newNumber = newValue / GAME_CONFIG.DIVISOR;

    return { addValue, newValue, newNumber };
}

export function resetGame() {
    players = [];
    currentPlayer = null;
    currentNumber = null;
}

export function addPlayer(playerId: string): string | null {
    if (isRoomAvailable()) {
        players.push(playerId);
        return `You are Player ${players.length}`;
    }
    return 'Room is full.';
}

export function handlePlayerMove(playerId: string): { addValue: number, newValue: number, newNumber: number, message?: string, playerMessage?: string, winnerId?: string } {
    const playerIndex = players.indexOf(playerId);
    
    if (isInvalidMove(playerId, playerIndex) || currentNumber === null) {
        return { message: "Invalid move", addValue: 0, newValue: 0, newNumber: 0 };
    }

    const addValue = calculateAddValue(currentNumber);
    const newValue = currentNumber + addValue;
    const newNumber = newValue / GAME_CONFIG.DIVISOR;

    currentNumber = newNumber;
    currentPlayer = players[getNextPlayerIndex(playerIndex)];

    let playerMessage = `You added ${addValue} to make it ${newValue} and then divided by ${GAME_CONFIG.DIVISOR}. Result: ${newNumber}`;

    if (newNumber === 1) {
        return { winnerId: playerId, addValue, newValue, newNumber, playerMessage};
    } else {
        return { message: `Player ${playerIndex + 1} added ${addValue} to make it divisible by 3 and then divided. Result: ${newNumber}`, addValue, newValue, newNumber, playerMessage };
    }
}

function isInvalidMove(playerId: string, playerIndex: number): boolean {
    return playerIndex === -1 || playerId !== currentPlayer;
}

export function removePlayer(playerId: string): void {
    const index = players.indexOf(playerId);
    if (index !== -1) {
        players.splice(index, 1);
    }
}

