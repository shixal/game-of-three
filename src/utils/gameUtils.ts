import { GAME_CONFIG } from '../config';

export function generateStartingNumber(): number {
    return Math.floor(Math.random() * 100) + 1;
}

export function getNextPlayerIndex(currentIndex: number): number {
    return (currentIndex + 1) % 2;
}

export function calculateAddValue(number: number): number {
    return [-1, 0, 1].find(value => (number + value) % GAME_CONFIG.DIVISOR === 0) || 0;
}