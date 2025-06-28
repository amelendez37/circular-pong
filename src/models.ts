export interface Player {
  x: number,
  y: number,
  draw: () => void;
  updatePosition: () => void;
}
