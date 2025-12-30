import { Server as SocketIOServer } from "socket.io";
import { createServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

// Game match interface
interface GameMatch {
  id: string;
  players: Player[];
  spectators: Spectator[];
  gameState: any;
  createdAt: number;
  lastActivity: number;
}

interface Player {
  id: string;
  socketId: string;
  name: string;
  team: 'red' | 'blue';
}

interface Spectator {
  id: string;
  socketId: string;
  name: string;
}

const matches = new Map<string, GameMatch>();

export function setupSocketIO() {
  const httpServer = createServer();
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Clean up inactive matches every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [matchId, match] of matches.entries()) {
      if (now - match.lastActivity > 3600000) { // 1 hour
        matches.delete(matchId);
        io.to(matchId).emit('match-ended', { reason: 'inactivity' });
      }
    }
  }, 300000);

  io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    // Create new match
    socket.on('create-match', (data: { playerName: string }) => {
      const matchId = Math.random().toString(36).substring(7);
      const match: GameMatch = {
        id: matchId,
        players: [{
          id: socket.id,
          socketId: socket.id,
          name: data.playerName,
          team: 'red'
        }],
        spectators: [],
        gameState: {},
        createdAt: Date.now(),
        lastActivity: Date.now()
      };
      
      matches.set(matchId, match);
      socket.join(matchId);
      socket.emit('match-created', { matchId });
    });

    // Join match as player
    socket.on('join-match', (data: { matchId: string; playerName: string }) => {
      const match = matches.get(data.matchId);
      if (!match) {
        socket.emit('error', { message: 'Match not found' });
        return;
      }

      if (match.players.length >= 6) {
        // Join as spectator if full
        match.spectators.push({
          id: socket.id,
          socketId: socket.id,
          name: data.playerName
        });
        socket.join(data.matchId);
        socket.emit('joined-as-spectator', { match });
        io.to(data.matchId).emit('spectator-joined', { spectator: data.playerName });
      } else {
        // Join as player
        match.players.push({
          id: socket.id,
          socketId: socket.id,
          name: data.playerName,
          team: match.players.length % 2 === 0 ? 'red' : 'blue'
        });
        socket.join(data.matchId);
        socket.emit('joined-as-player', { match });
        io.to(data.matchId).emit('player-joined', { player: data.playerName });
      }
      
      match.lastActivity = Date.now();
    });

    // Update game state
    socket.on('update-game-state', (data: { matchId: string; gameState: any }) => {
      const match = matches.get(data.matchId);
      if (match) {
        match.gameState = data.gameState;
        match.lastActivity = Date.now();
        socket.to(data.matchId).emit('game-state-updated', data.gameState);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      for (const [matchId, match] of matches.entries()) {
        const playerIndex = match.players.findIndex(p => p.socketId === socket.id);
        if (playerIndex !== -1) {
          match.players.splice(playerIndex, 1);
          io.to(matchId).emit('player-left', { playerId: socket.id });
        }

        const specIndex = match.spectators.findIndex(s => s.socketId === socket.id);
        if (specIndex !== -1) {
          match.spectators.splice(specIndex, 1);
          io.to(matchId).emit('spectator-left', { spectatorId: socket.id });
        }

        // Delete match if empty
        if (match.players.length === 0 && match.spectators.length === 0) {
          matches.delete(matchId);
        }
      }
    });
  });

  return { io, httpServer };
}