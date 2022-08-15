export type MoveCursorParams = {
  x: number;
  y: number;
};

export interface MoveCursor {
  execute: (params: MoveCursorParams) => Promise<void>;
}
