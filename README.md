# Divisible by Three Game
A two-player game where players take turns adjusting a number to make it divisible by three and then divide it by three.  
The goal is to reach the number 1.

## Architecture Diagram: 
<img alt="architecture" src="https://img.onl/v2lluv">

## Prerequisites
Ensure you have the following installed:

Node.js
npm (Node Package Manager)
http-server (For serving client files. Install globally with npm install -g http-server)

### Install dependencies:
- npm install  

Compile Typescript files:
- npm run compile

Build client files:
- npm run build

Run the server:
- npm run start

Serve client files:
- http-server

Open a web browser and navigate to http://127.0.0.1:8080.  
Start a game by connecting with two different browser windows or tabs.


## How to Play
Players connect to the server. Once two players are connected, the game begins.  
A random number between 1 and 100 is generated.

Players take turns adding either -1, 0, or 1 to the number to make it divisible by 3.  
After adjusting the number, it's then divided by three.

The game continues with players taking turns until the number reaches 1.  
The player who reaches 1 is the winner.


## Game Mechanics
When it's a player's turn, they must click the "Play Turn" button to submit their move.  
The game log displays the current number, the amount added or subtracted, and the result of division by 3.  
The game ends when the number reaches 1. The game log displays the winner.


## Technical Overview
The game uses the following technologies:

### Backend: 
Node.js with the Express.js framework.

### WebSockets: 
For real-time bidirectional communication between the server and clients.
### Frontend:
Vanilla JavaScript.



## Game Screenshots
###  Player 1
<img alt="player1" src="https://img.onl/kIv09p">


###  Player 2
<img alt="player2" src="https://img.onl/4oSrZO">
