import { GameStatus } from '@nonogram-api-monorepo/types';
import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  setGameStatus: React.Dispatch<React.SetStateAction<GameStatus | null>>;
};

export const WonPopup: React.FC<Props> = ({ setGameStatus }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-absoluteWhite rounded-lg flex flex-col w-[15%] h-[25%] items-center justify-between p-5 border border-absoluteBlack">
        <span className="font-bold text-2xl">You WON!</span>
        <span>you actually made it...</span>
        <div className="flex flex-row justify-around items-center w-full">
          <Link
            to="/home"
            className="hover:scale-105 active:scale-95 transition-transform border border-absoluteBlack p-2 rounded-lg shadow-xl"
          >
            <button>Home</button>
          </Link>
          <button
            onClick={() => setGameStatus(null)}
            className="hover:scale-105 active:scale-95 transition-transform border border-absoluteBlack p-2 rounded-lg shadow-xl"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
