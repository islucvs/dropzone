export interface Player {
  id: string;
  socketId: string;
  name: string;
  team: 'red' | 'blue';
}

export interface Spectator {
  id: string;
  socketId: string;
  name: string;
}
