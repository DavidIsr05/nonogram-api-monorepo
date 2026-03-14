import { TileStates } from '@nonogram-api-monorepo/types';
import React, { useState } from 'react';

type Props = {
  uncompletedNonogram: TileStates[][];
};

export const Board: React.FC<Props> = ({ uncompletedNonogram }) => {
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleOnClick = (index: number) => {
    setIsMouseDown(true);

    console.log(Math.floor(index / 40));
    console.log(index % 40);
  };

  const onMouseOver = (index: number) => {
    if (isMouseDown) {
      console.log(Math.floor(index / 40));
      console.log(index % 40);
    }
  };

  return (
    <div
      className="grid w-full h-full min-h-0 min-w-0"
      style={{
        gridTemplateColumns: `repeat(${uncompletedNonogram[0].length}, 1fr)`,
        gridTemplateRows: `repeat(${uncompletedNonogram.length}, 1fr)`,
      }}
    >
      {uncompletedNonogram.flat().map((tile, index) => (
        <button
          className="border"
          onMouseDown={() => handleOnClick(index)}
          onMouseOver={() => onMouseOver(index)}
          onMouseUp={() => setIsMouseDown(false)}
          key={index}
        >
          <div className={``} />
        </button>
      ))}
    </div>
  );
};
