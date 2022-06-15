export interface checkSquareResult {
  hasWon: boolean;
  hasTie: boolean;
  winningSquares?: number[];
}

export interface playerInfoResult {
  name: string;
  score: number;
}