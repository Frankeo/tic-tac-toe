import { configureStore, createReducer } from '@reduxjs/toolkit';
import { closePopup, resetGame, tiePopup, winPopup } from './actions';
import { check, setPlayer } from './middlewares';
import { MatchState, PlayersState } from './state';

const initialBoardState: string[] = new Array(9).fill("");

export const boardReducer = createReducer(initialBoardState, (builder) => {
  builder.addCase(resetGame, () => [...initialBoardState]);
  builder.addCase(check.fulfilled, (state, { payload }) => {
    const newState = [...state];
    newState[payload.position] = payload.value;
    return [...newState]
  })
});

const initialPlayersState = {
  isOpen: true
} as PlayersState;

export const playersReducer = createReducer(initialPlayersState, (builder) => {
  builder.addCase(resetGame, () => ({
    ...initialPlayersState
  }));
  builder.addCase(closePopup, (state, _) => ({
      ...state,
      isOpen: false
  }));
  builder.addCase(setPlayer.fulfilled, (state, { type, payload }) => {
    const { name, number, score } = payload;
    const playerIndex =  'player' + number;
    return {
      ...state,
      [playerIndex]: {
        name,
        score
      }
    }
  });
});

const initialMatchState = {
  hasWon: false,
  hasTie: false
} as MatchState;

export const matchReducer = createReducer(initialMatchState, (builder) => {
  builder.addCase(resetGame, () => ({
    ...initialMatchState
  }));
  builder.addCase(winPopup, (state, _) =>({
    ...state,
    hasWon: true
  }));
  builder.addCase(tiePopup, (state, _) =>({
    ...state,
    hasTie: true
  }));
})

const rootReducer = {
  board: boardReducer,
  players: playersReducer,
  match: matchReducer
}

export const store = configureStore({ reducer: rootReducer });