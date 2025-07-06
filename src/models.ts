export interface Player {
  getPlayerLoc: () => PlayerLocation;
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
  state: {
    hasServed: boolean;
  }
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
  updatePosition: () => void;
  // score
  // who serves next
}

export interface Coord {
  x: number;
  y: number;
}

export interface PlayerLocation {
  x: number,
  y: number,
  radius: number;
  lineWidth: number;
}
