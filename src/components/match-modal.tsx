import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Popup from 'reactjs-popup';
import '../App.css'
import 'reactjs-popup/dist/index.css';
import { hasTieSelector, hasWonSelector, isOpenSelector } from '../redux/selectors';
import { resetGame } from '../redux/actions';

export const MatchModal = () => {
  const hasWon = useSelector(hasWonSelector);
  const hasTie = useSelector(hasTieSelector);
  const dispatch = useDispatch();
  const resetClick = () => dispatch(resetGame());

  return (
    <Popup open={hasWon || hasTie} modal nested>
      <div className="modal">
        <div className="header">{ hasWon? "WON" : "TIE" }</div>
        <div className="content">
          { hasWon? "WON" : "TIE" }
        </div>
        <div className="actions">
          <button className="button" onClick={resetClick}>
            start again
          </button>
        </div>
      </div>
    </Popup>
  );
}