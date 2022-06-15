import { createAsyncThunk } from "@reduxjs/toolkit"
import { checkMark, getPlayerInfo } from "../APIs/server-api";
import { tiePopup, winPopup } from "./actions";
import { player1Selector } from "./selectors";
import { State } from "./state";

export interface moveProps {
  playerName: string;
  rivalName: string;
  position: number;
}

export interface squareProps {
  position: number;
  value: string;
}


export const check = createAsyncThunk<squareProps, moveProps>('check', 
  async({position, playerName, rivalName}, thunkAPI) => {
  const result = await checkMark({ position, playerName, rivalName });
  if(result.hasWon) thunkAPI.dispatch(winPopup());
  if(result.hasTie) thunkAPI.dispatch(tiePopup());
  const { name } = player1Selector(thunkAPI.getState() as State) || {};
  return { position, value: playerName == name? "O" : "X" };
});

interface playerProps {
  number: number;
  name: string;
  score?: number;
}

export const setPlayer = createAsyncThunk<playerProps, playerProps>('player', 
  async({name, number}) => {
    const result = await getPlayerInfo(name);
    return {
      name: result.name,
      score: result.score,
      number
    }
});

export const setPlayer1 = (name: string) => setPlayer({ name, number: 1});
export const setPlayer2 = (name: string) => setPlayer({ name, number: 2});
