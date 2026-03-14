import {
  GameWithCluesResponseType,
  TileStates,
} from '@nonogram-api-monorepo/types';
import React, { useState } from 'react';
import { Hint, Timer, Mistakes, Restart } from '../../../assets/images';

type Props = GameWithCluesResponseType;

export const GameBoard: React.FC<Props> = ({
  rowClues,
  colClues,
  uncompletedNonogram,
  timer,
  mistakes,
  hints,
}) => {
  const [isMouseDown, setIsMouseDown] = useState(false);

  const AVALIABLE_PIXELS_COUNT = 650;

  const tileSize = Math.floor(AVALIABLE_PIXELS_COUNT / colClues.length);

  const handleMouseDown = (row: number, col: number, tile: TileStates) => {
    setIsMouseDown(true);
    console.log(row, col, tile);
  };

  const handleMouseOver = (row: number, col: number) => {
    if (isMouseDown) {
      console.log(row, col);
    }
  };

  return (
    <div className="flex flex-row w-[60%] h-[90%] border rounded-xl shadow-xl justify-around items-center">
      <div className="flex items-center justify-center">
        <table
          className=""
          onMouseLeave={() => setIsMouseDown(false)}
          onMouseUp={() => setIsMouseDown(false)}
        >
          <thead>
            <tr>
              <th />
              {colClues.map((col, colIndex) => (
                <td
                  key={colIndex}
                  style={{ width: tileSize }}
                  className="align-bottom pb-1"
                >
                  <div className="flex flex-col items-center leading-none text-xs gap-1">
                    {col.map((colClue, colClueIndex) => (
                      <span key={colClueIndex}>{colClue}</span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {uncompletedNonogram!.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="pr-1">
                  <div className="flex flex-row justify-end leading-none text-xs gap-1">
                    {rowClues[rowIndex].map((rowClue, rowClueIndex) => (
                      <span key={rowClueIndex}>{rowClue}</span>
                    ))}
                  </div>
                </td>
                {row.map((tile, colIndex) => (
                  <td
                    key={colIndex}
                    style={{ width: tileSize, height: tileSize }}
                    className={`border cursor-pointer ${
                      tile === TileStates.FILLED
                        ? 'bg-absoluteBlack'
                        : 'bg-absoluteWhite'
                    }`}
                    onMouseDown={() =>
                      handleMouseDown(rowIndex, colIndex, tile)
                    }
                    onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
                    onMouseUp={() => setIsMouseDown(false)}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col h-[85%] items-center justify-between p-5 text-4xl">
        <button>
          <Restart />
        </button>
        <button className="flex flex-row" disabled={hints === 3}>
          <Hint />
          {hints}/3
        </button>
        <span className="flex flex-row items-center">
          <Mistakes />
          {mistakes}/3
        </span>
        <span className="flex flex-row items-center">
          <Timer />
          {timer}
        </span>
      </div>
    </div>
  );
};
