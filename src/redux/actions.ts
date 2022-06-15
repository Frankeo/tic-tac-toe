import { createAction } from "@reduxjs/toolkit";

export const resetGame = createAction('resetPlayers');
export const winPopup = createAction('win');
export const tiePopup = createAction('tie');
export const closePopup = createAction('close');