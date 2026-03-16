import {
  GameWithCluesResponseType,
  TileStates,
} from '@nonogram-api-monorepo/types';
import React, { useEffect, useRef, useState } from 'react';
import { Timer, Mistakes, Restart } from '../../../assets';
import { MISTAKES_THRESHOLD } from '../../../constants';
import { useUpdateGameMutation } from '../../../store/api';

type Props = GameWithCluesResponseType & { gameId: string };

export const GameBoard: React.FC<Props> = ({
  rowClues,
  colClues,
  uncompletedNonogram,
  timer,
  mistakes,
  gameId,
}) => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [callUpdateGameQuery] = useUpdateGameMutation();
  const [elapsedTime, setElapsedTime] = useState(timer);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const AVALIABLE_PIXELS_COUNT = 600;

  const tileSize = Math.floor(AVALIABLE_PIXELS_COUNT / colClues.length);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleMouseDown = (row: number, col: number, tile: TileStates) => {
    setIsMouseDown(true);
    console.log(row, col, tile);
  };

  const handleMouseOver = (row: number, col: number) => {
    if (isMouseDown) {
      console.log(row, col);
    }
  };

  const handleResetButtonOnClick = () => {
    callUpdateGameQuery({ id: gameId, timer: 0 });
  };

  const gameBoardTableBody = uncompletedNonogram!.map((row, rowIndex) => (
    <tr key={rowIndex}>
      <td className="p-0 border-r border-t border-b border-absoluteBlack/30 border-r-absoluteBlack">
        <div className="flex flex-row justify-end">
          {rowClues[rowIndex].map((rowClue, rowClueIndex) => (
            <div
              key={rowClueIndex}
              style={{ width: tileSize, height: tileSize }}
              className="border-l border-absoluteBlack/30 flex items-center justify-center text-xs"
            >
              {rowClue}
            </div>
          ))}
        </div>
      </td>
      {row.map((tile, colIndex) => (
        <td
          key={colIndex}
          style={{ width: tileSize, height: tileSize }}
          className={`border cursor-pointer ${
            tile === TileStates.FILLED ? 'bg-absoluteBlack' : 'bg-absoluteWhite'
          }`}
          onMouseDown={() => handleMouseDown(rowIndex, colIndex, tile)}
          onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
          onMouseUp={() => setIsMouseDown(false)}
        />
      ))}
    </tr>
  ));

  return (
    <div className="flex flex-col w-[60%] h-[90%] items-center">
      <div className="flex items-center justify-center border border-absoluteBlack">
        <table
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
                  className="p-0 align-bottom border-r border-l border-b border-b-absoluteBlack border-absoluteBlack/30"
                >
                  <div className="flex flex-col items-end">
                    {col.map((colClue, colClueIndex) => (
                      <div
                        key={colClueIndex}
                        style={{ width: tileSize, height: tileSize }}
                        className="border-t border-absoluteBlack/30 flex items-center justify-center text-xs"
                      >
                        {colClue}
                      </div>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </thead>
          <tbody>{gameBoardTableBody}</tbody>
        </table>
      </div>

      <div className="flex flex-row h-[85%] items-center gap-28 p-5 text-4xl">
        <button onClick={handleResetButtonOnClick}>
          <Restart />
        </button>
        <span className="flex flex-row items-center">
          <Mistakes />
          {mistakes}/{MISTAKES_THRESHOLD}
        </span>
        <span className="flex flex-row items-center tabular-nums">
          <Timer />
          {formatTime(elapsedTime)}
        </span>
      </div>
    </div>
  );
};
