export interface Player {
  x: number,
  y: number,
  draw: () => void;
  updatePosition: () => void;
}

export interface GameState {
  getState: () => StateOfGame;
  setState: (x: StateOfGame) => void;
}

export interface StateOfGame {
  p1: Player;
  p2: Player;
  gameBall: GameBall;
  arena: Arena;
}

export interface Arena {
  cx: number;
  cy: number;
  radius: number;
  draw: () => void;
}

export interface GameBall {
  // x: number,
  // y: number,
  draw: (gameState: GameState) => void;
  // updatePosition: () => void;
}

export interface Coord {
  x: number;
  y: number;
}
