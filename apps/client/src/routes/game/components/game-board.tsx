import {
  GameStatus,
  GameWithCluesResponseType,
  MISTAKES_THRESHOLD,
  TileStates,
} from '@nonogram-api-monorepo/types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Timer, Mistakes, Wrong } from '../../../assets';
import {
  useUpdateGameMutation,
  useCheckAndUpdateInProgressNonogramMutation,
} from '../../../store/api';
import { formatTime } from '../../../utils';
import debounce from 'debounce';
import { GamePopup } from './index';
import { DIFFICULTY_SIZE } from '../../../constants';

type Props = GameWithCluesResponseType;

export const GameBoard: React.FC<Props> = ({
  rowClues,
  colClues,
  uncompletedNonogram,
  timer,
  mistakes,
  id,
  isFinished,
  nonogramDifficulty,
}) => {
  const [callUpdateGameQuery] = useUpdateGameMutation();
  const [checkAndUpdateInProgressNonogram] =
    useCheckAndUpdateInProgressNonogramMutation();

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(timer);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [gameStatus, setGameStatus] = useState<GameStatus | null>(
    isFinished
      ? null
      : mistakes >= MISTAKES_THRESHOLD
      ? GameStatus.LOST
      : GameStatus.FINE
  );
  const [isLostPopupDismissed, setIsLostPopupDismissed] = useState(false);

  const coordinatesRef = useRef<{ rowIndex: number; colIndex: number }[]>([]);
  const elapsedTimeRef = useRef(elapsedTime);
  elapsedTimeRef.current = elapsedTime;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameStatus === GameStatus.FINE) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isFinished, gameStatus]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setContainerSize({ width, height });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const debouncedCheck = useMemo(
    () =>
      debounce(async () => {
        const { data } = await checkAndUpdateInProgressNonogram({
          gameId: id,
          timer: elapsedTimeRef.current,
          inProgressNonogramCoordinates: coordinatesRef.current,
        });

        if (data?.status) {
          setGameStatus(data.status);
        }

        coordinatesRef.current = [];
      }, 500),
    []
  );

  useEffect(() => {
    const handleBeforeUnload = () => {
      debouncedCheck.flush();
      callUpdateGameQuery({ id, timer: elapsedTimeRef.current });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      callUpdateGameQuery({ id, timer: elapsedTimeRef.current });
    };
  }, [debouncedCheck]);

  const maxRowClues = Math.max(...rowClues.map((row) => row.length));
  const maxColClues = Math.max(...colClues.map((col) => col.length));
  const totalCols = maxRowClues + uncompletedNonogram[0].length;
  const totalRows = maxColClues + uncompletedNonogram.length;
  const tileSize = Math.floor(
    Math.min(containerSize.width / totalCols, containerSize.height / totalRows)
  );

  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    setIsMouseDown(true);
    markTile(rowIndex, colIndex);
  };

  const handleMouseOver = (rowIndex: number, colIndex: number) => {
    if (isMouseDown) {
      markTile(rowIndex, colIndex);
    }
  };

  const markTile = (rowIndex: number, colIndex: number) => {
    if (!isFinished && gameStatus === GameStatus.FINE) {
      coordinatesRef.current.push({ rowIndex, colIndex });
      debouncedCheck();
    }
  };

  const isTileMarked = (rowIndex: number, colIndex: number) => {
    return coordinatesRef.current.some(
      (cords) => cords.rowIndex === rowIndex && cords.colIndex === colIndex
    );
  };

  const paddedRowClues = rowClues.map((clues) =>
    new Array(maxRowClues - clues.length).fill(null).concat(clues)
  );

  const paddedColClues = colClues.map((clues) =>
    new Array(maxColClues - clues.length).fill(null).concat(clues)
  );

  const gameBoardTableBody = uncompletedNonogram.map((row, rowIndex) => (
    <tr key={rowIndex}>
      <td className="p-0 border-r border-t border-b border-absoluteBlack/30 border-r-absoluteBlack">
        <div className="flex flex-row justify-end">
          {paddedRowClues[rowIndex].map((rowClue, rowClueIndex) => (
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
      {row.map((tile, colIndex) => {
        if (tile === TileStates.MISTAKE) {
          return (
            <td
              key={colIndex}
              style={{ width: tileSize, height: tileSize }}
              className="border"
            >
              <Wrong className="w-full h-full" />
            </td>
          );
        } else if (isTileMarked(rowIndex, colIndex)) {
          return (
            <td
              key={colIndex}
              style={{ width: tileSize, height: tileSize }}
              className="bg-prettyGray border"
            />
          );
        } else if (tile === TileStates.FILLED) {
          return (
            <td
              key={colIndex}
              style={{ width: tileSize, height: tileSize }}
              className={`border bg-absoluteBlack`}
            />
          );
        } else {
          return (
            <td
              key={colIndex}
              style={{ width: tileSize, height: tileSize }}
              className={`border cursor-pointer`}
              onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
              onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
              onMouseUp={() => setIsMouseDown(false)}
            />
          );
        }
      })}
    </tr>
  ));

  return (
    <div className="flex flex-col w-[70%] h-full items-center select-none">
      {gameStatus === GameStatus.LOST && !isLostPopupDismissed && (
        <GamePopup
          gameStatus={gameStatus}
          onDismiss={() => setIsLostPopupDismissed(true)}
        />
      )}
      {gameStatus === GameStatus.WON && (
        <GamePopup
          gameStatus={gameStatus}
          onDismiss={() => setGameStatus(null)}
        />
      )}

      <div
        ref={containerRef}
        className="flex items-center justify-center flex-1 min-h-0 w-full"
      >
        <table
          onMouseLeave={() => setIsMouseDown(false)}
          onMouseUp={() => setIsMouseDown(false)}
          className="border border-absoluteBlack bg-absoluteWhite"
        >
          <thead>
            <tr>
              <th />
              {paddedColClues.map((col, colIndex) => (
                <td
                  key={colIndex}
                  style={{ width: tileSize }}
                  className="p-0 align-bottom border-r border-l border-b border-b-absoluteBlack border-absoluteBlack/30"
                >
                  <div className="flex flex-col items-center">
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

      <div className="flex flex-row items-center gap-28 mt-5 text-4xl">
        <span className="text-center" role="img" aria-label="size emoji">
          📐 {DIFFICULTY_SIZE[nonogramDifficulty]}
        </span>
        <span className="flex flex-row items-center tabular-nums">
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
