import { Action, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { State } from './redux/state';

export type AppDispatch = ThunkDispatch<State, any, Action<any>>;
export const useAppDispatch = () => useDispatch<AppDispatch>();