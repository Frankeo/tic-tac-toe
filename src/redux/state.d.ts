export interface PlayerState {
  name: string;
  score: number;
}

export interface PlayersState {
  isOpen: boolean,
  player1?: PlayerState,
  player2?: PlayerState,
}

export interface MatchState {
  hasWon: boolean;
  hasTie: boolean;
}

export interface State {
  players: PlayersState;
  board: sting[];
  match: MatchState;
}