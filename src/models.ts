export interface Player {
  x: number,
  y: number,
  draw: (gameState: GameState) => void;
  updatePosition: () => void;
}

export interface GameState {
  arena: Arena;
  p1: Player;
}

export interface Arena {
  cx: number;
  cy: number;
  radius: number;
  draw: () => void;
}

export interface Coord {
  x: number;
  y: number;
}
