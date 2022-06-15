import React from 'react';
import { Square } from './components/square';
import './App.css';
import { useSelector } from 'react-redux';

import { State } from './redux/state';
import { PlayersModal } from './components/players-modal';
import { MatchHeader } from './components/match-header';
import { useAppDispatch } from './custom-hooks';
import { boardSelector, movesSelector, player1Selector, player2Selector } from './redux/selectors';
import { check } from './redux/middlewares';
import { MatchModal } from './components/match-modal';

function App() {
  const dispatch = useAppDispatch();
  const board = useSelector(boardSelector);
  const player1 = useSelector(player1Selector);
  const player2 = useSelector(player2Selector);
  const moves = useSelector<State, number>(movesSelector);
  const chooseSquare = (position: number) => {
    if (moves % 2) dispatch(check({ position, playerName: player2?.name!, rivalName: player1?.name! }));
    else dispatch(check({ position, playerName: player1?.name!, rivalName: player2?.name! }));
  }

  return (
    <div className="App">
      <MatchHeader />
      <PlayersModal />
      <MatchModal />
      <div className='board'>
        <div className='row'>
          <Square val={board[0]} chooseSquare={() => chooseSquare(0)} />
          <Square val={board[1]} chooseSquare={() => chooseSquare(1)} />
          <Square val={board[2]} chooseSquare={() => chooseSquare(2)} />
        </div>
        <div className='row'>
          <Square val={board[3]} chooseSquare={() => chooseSquare(3)} />
          <Square val={board[4]} chooseSquare={() => chooseSquare(4)} />
          <Square val={board[5]} chooseSquare={() => chooseSquare(5)} />
        </div>
        <div className='row'>
          <Square val={board[6]} chooseSquare={() => chooseSquare(6)} />
          <Square val={board[7]} chooseSquare={() => chooseSquare(7)} />
          <Square val={board[8]} chooseSquare={() => chooseSquare(8)} />
        </div>
      </div>
    </div>
  );
}

export default App;
