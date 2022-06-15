import { createSelector } from "@reduxjs/toolkit";
import { State } from "./state";

export const boardSelector = (state: State) => state.board;
export const movesSelector = createSelector(boardSelector, (state) => state.filter(Boolean).length);
const playersSelector = (state: State) => state.players;
export const isOpenSelector = createSelector(playersSelector, (state) => state.isOpen);

export const player1Selector = createSelector(playersSelector, (state) => state.player1);
export const player2Selector = createSelector(playersSelector, (state) => state.player2);

const matchSelector = (state: State) => state.match;
export const hasWonSelector = createSelector(matchSelector, (state) => state.hasWon);
export const hasTieSelector = createSelector(matchSelector, (state) => state.hasTie);