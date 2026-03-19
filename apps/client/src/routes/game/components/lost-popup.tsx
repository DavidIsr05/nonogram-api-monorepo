import { GameStatus } from '@nonogram-api-monorepo/types';
import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  setIsLostPopupDismissed: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LostPopup: React.FC<Props> = ({ setIsLostPopupDismissed }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-absoluteWhite rounded-lg flex flex-col w-[15%] h-[25%] items-center justify-between p-5 border border-absoluteBlack">
        <span className="font-bold text-2xl">You Lost!</span>
        <span className="w-full">You have reached mistake treshold</span>
        <div className="flex flex-row justify-around w-full items-center">
          <Link
            to="/home"
            className="hover:scale-105 active:scale-95 transition-transform border border-absoluteBlack p-2 rounded-lg bg-prettyGray/20 shadow-xl"
          >
            <button>Home</button>
          </Link>
          <button
            onClick={() => setIsLostPopupDismissed(true)}
            className="hover:scale-105 active:scale-95 transition-transform border border-absoluteBlack p-2 rounded-lg shadow-xl"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
