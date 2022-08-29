export type MoveCursorParams = {
  x: number;
  y: number;
};

export interface ControlMouse {
  moveCursor: (params: MoveCursorParams) => Promise<number>;
}
