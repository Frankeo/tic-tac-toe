import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Popup from 'reactjs-popup';
import '../App.css'
import { closePopup } from '../redux/actions';
import 'reactjs-popup/dist/index.css';
import './players-modal.css';
import { isOpenSelector } from '../redux/selectors';
import { setPlayer1, setPlayer2 } from '../redux/middlewares';
import { useAppDispatch } from '../custom-hooks';

export const PlayersModal = () => {
  const isOpen = useSelector(isOpenSelector);
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const dispatch = useAppDispatch();
  const submitModal = () => {
    dispatch(setPlayer1(player1Name));
    dispatch(setPlayer2(player2Name));
    dispatch(closePopup());
  };
  return (
    <Popup open={isOpen} modal nested>
      <div className="modal">
        <div className="header">Set Players</div>
        <div className="content">
          <div className='inputs'>
            <label htmlFor="player1">Player 1:</label>
            <input type="text" id="player1" name="player1" onChange={(e) => setPlayer1Name(e.target.value)} value={player1Name} />
          </div>
          <div className='inputs'>
            <label htmlFor="player2">Player 2:</label>
            <input type="text" id="player2" name="player2" onChange={(e) => setPlayer2Name(e.target.value)} value={player2Name} />
          </div>
        </div>
        <div className="actions">
          <button className="button" onClick={submitModal}>
            submit
          </button>
        </div>
      </div>
    </Popup>
  );
}