//
//
// UNUSED FILE. //TODO either delete or use
//
//
import { TileStates } from '@nonogram-api-monorepo/types';
import React, { useState } from 'react';

type Props = {
  uncompletedNonogram: TileStates[][];
};

export const Board: React.FC<Props> = ({ uncompletedNonogram }) => {
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleOnMouseDown = (index: number, tile: TileStates) => {
    setIsMouseDown(true);

    console.log(Math.floor(index / 40));
    console.log(index % 40);

    console.log(tile);
  };

  const onMouseOver = (index: number) => {
    if (isMouseDown) {
      console.log(Math.floor(index / 40));
      console.log(index % 40);
    }
  };

  return (
    <div className="flex  w-full h-[90%]">
      <div
        className="grid aspect-square max-h-full max-w-full"
        style={{
          gridTemplateColumns: `repeat(${uncompletedNonogram[0].length}, 1fr)`,
          gridTemplateRows: `repeat(${uncompletedNonogram.length}, 1fr)`,
        }}
        onMouseLeave={() => setIsMouseDown(false)}
      >
        {uncompletedNonogram.flat().map((tile, index) => (
          <button
            onMouseDown={() => handleOnMouseDown(index, tile)}
            onMouseOver={() => onMouseOver(index)}
            onMouseUp={() => setIsMouseDown(false)}
            key={index}
          >
            <div
              className={`
              ${
                tile === TileStates.FILLED
                  ? 'bg-absoluteBlack'
                  : 'bg-absoluteWhite'
              } w-full h-full border
            `}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
