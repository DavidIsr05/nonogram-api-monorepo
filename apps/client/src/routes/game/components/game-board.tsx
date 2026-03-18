import {
  GameWithCluesResponseType,
  TileStates,
} from '@nonogram-api-monorepo/types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Timer, Mistakes, Restart, Wrong } from '../../../assets';
import { MISTAKES_THRESHOLD } from '../../../constants';
import {
  useUpdateGameMutation,
  useCheckAndUpdateInProgressNonogramMutation,
} from '../../../store/api';
import { formatTime } from '../../../utils';
import debounce from 'debounce';

type Props = GameWithCluesResponseType;

export const GameBoard: React.FC<Props> = ({
  rowClues,
  colClues,
  uncompletedNonogram,
  timer,
  mistakes,
  id,
  isFinished,
}) => {
  const [callUpdateGameQuery] = useUpdateGameMutation();
  const [checkAndUpdateInProgressNonogram] =
    useCheckAndUpdateInProgressNonogramMutation();
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(timer);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const coordinatesRef = useRef<{ rowIndex: number; colIndex: number }[]>([]);
  const elapsedTimeRef = useRef(elapsedTime);
  elapsedTimeRef.current = elapsedTime;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFinished) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setContainerSize({ width, height });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const maxRowClues = Math.max(...rowClues.map((r) => r.length));
  const maxColClues = Math.max(...colClues.map((c) => c.length));
  const totalCols = maxRowClues + uncompletedNonogram[0].length;
  const totalRows = maxColClues + uncompletedNonogram.length;
  const tileSize = Math.floor(
    Math.min(containerSize.width / totalCols, containerSize.height / totalRows)
  );

  const handleMouseDown = (row: number, col: number) => {
    setIsMouseDown(true);
    markTile(row, col);
  };

  const handleMouseOver = (row: number, col: number) => {
    if (isMouseDown) {
      markTile(row, col);
    }
  };

  const handleResetButtonOnClick = () => {
    callUpdateGameQuery({ id, timer: 0 });
    setElapsedTime(0);
  };

  const debouncedCheck = useMemo(
    () =>
      debounce(() => {
        checkAndUpdateInProgressNonogram({
          gameId: id,
          timer: elapsedTimeRef.current,
          inProgressNonogramCoordinates: coordinatesRef.current,
        });
        coordinatesRef.current = [];
      }, 500),
    []
  );

  const markTile = (rowIndex: number, colIndex: number) => {
    coordinatesRef.current.push({ rowIndex, colIndex });
    debouncedCheck();
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
      {row.map((tile, colIndex) =>
        tile === TileStates.MISTAKE ? (
          <td
            key={colIndex}
            style={{ width: tileSize, height: tileSize }}
            className="border"
          >
            <Wrong className="w-full h-full" />
          </td>
        ) : tile === TileStates.MARKED ? (
          <td
            key={colIndex}
            style={{ width: tileSize, height: tileSize }}
            className="bg-prettyGray border"
          />
        ) : tile === TileStates.FILLED ? (
          <td
            key={colIndex}
            style={{ width: tileSize, height: tileSize }}
            className={`border bg-absoluteBlack`}
          />
        ) : (
          <td
            key={colIndex}
            style={{ width: tileSize, height: tileSize }}
            className={`border cursor-pointer`}
            onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
            onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
            onMouseUp={() => setIsMouseDown(false)}
          />
        )
      )}
    </tr>
  ));

  return (
    <div className="flex flex-col w-[70%] h-full items-center">
      <div
        ref={containerRef}
        className="flex items-center justify-center flex-1 min-h-0 w-full"
      >
        <table
          onMouseLeave={() => setIsMouseDown(false)}
          onMouseUp={() => setIsMouseDown(false)}
          className="border border-absoluteBlack"
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
