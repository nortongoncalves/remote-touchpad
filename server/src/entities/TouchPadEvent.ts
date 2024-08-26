export type TouchPadEvent = {
  type: 'Move' | 'LeftClick' | 'RightClick';
  moveLocationX?: string;
  moveLocationY?: string;
}
