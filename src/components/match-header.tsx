import React from 'react';
import { useSelector } from 'react-redux';
import '../App.css';
import { player1Selector, player2Selector } from '../redux/selectors';

export const MatchHeader = () => {
  const player1 = useSelector(player1Selector);
  const player2 = useSelector(player2Selector);

  return (
    <div className='match-header'>
      <p>{ `${player1?.name ?? ""} ${player1?.score ?? ""}` }</p>
      <p>{ `${player2?.name ?? ""} ${player2?.score ?? ""}` }</p>
    </div>
  );
}