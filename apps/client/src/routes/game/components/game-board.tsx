import { GameWithCluesResponseType } from '@nonogram-api-monorepo/types';
import React from 'react';
import { Hint, Timer, Mistakes, Restart } from '../../../assets/images';
import { Board } from './board';

type Props = GameWithCluesResponseType;

export const GameBoard: React.FC<Props> = ({
  rowClues,
  colClues,
  uncompletedNonogram,
  timer,
  mistakes,
  hints,
}) => {
  return (
    <div className="flex flex-col w-[70%] h-full">
      <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] bg-absoluteWhite rounded-xl shadow-xl p-3 h-[90%]">
        <div className="h-0 w-0" />
        <div className="flex flex-row justify-around">
          {colClues.map((col, colIndex) => (
            <div key={colIndex} className="flex flex-col items-center">
              {col.map((clue, clueIndex) => (
                <span key={clueIndex} className="leading-none text-sm">
                  {clue}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-around">
          {rowClues.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-row items-end gap-3">
              {row.map((clue, clueIndex) => (
                <span key={clueIndex} className="leading-none text-sm">
                  {clue}
                </span>
              ))}
            </div>
          ))}
        </div>
        <Board uncompletedNonogram={uncompletedNonogram!} />
      </div>

      <div className="flex flex-row h-[10%] w-full items-center justify-between p-5 text-4xl">
        <button>
          <Restart className="aspect-square w-[2.5rem]" />
        </button>
        <button className="flex flex-row">
          <Hint className="aspect-square w-[2.5rem]" />
          {hints}/3
        </button>
        <span className="flex flex-row items-center">
          <Timer className="aspect-square w-[2.5rem]" />
          {timer}
        </span>
        <span className="flex flex-row items-center">
          <Mistakes className="aspect-square w-[2.5rem]" />
          {mistakes}/3
        </span>
      </div>
    </div>
  );
};
