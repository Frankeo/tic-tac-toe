import React from 'react';
import '../App.css';

export interface SqaureProps {
  val: string;
  chooseSquare: () => void;
}

export const Square = ({ val, chooseSquare }: SqaureProps) => {
  return <div className='square' onClick={chooseSquare}>{val}</div>;
}