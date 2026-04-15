import { GameStatus } from '@nonogram-api-monorepo/types';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useGetFinishedGameQuery } from '../../../store/api';
import { ErrorState, LoadingState } from '../../../components';

type Props = {
  gameStatus: GameStatus.WON | GameStatus.LOST;
  onLikeClick: () => void;
  gameId: string;
};

export const GamePopup: React.FC<Props> = ({
  gameStatus,
  onLikeClick,
  gameId,
}) => {
  const [reacted, setReacted] = useState(false);
  const navigate = useNavigate();

  const {
    data: finishedGame,
    isLoading: isFinishedGameLoading,
    isError: isErrorWhileFetchingFinishedGame,
    error: finishedGameError,
  } = useGetFinishedGameQuery(gameId, { skip: !gameId });

  if (gameStatus === GameStatus.WON && isErrorWhileFetchingFinishedGame) {
    return <ErrorState error={finishedGameError} />;
  }

  if (gameStatus === GameStatus.WON && isFinishedGameLoading) {
    return <LoadingState />;
  }

  if (!finishedGame) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-30">
      {gameStatus === GameStatus.WON && (
        <div className="w-full h-full flex items-center justify-center">
          <Confetti
            className="w-full h-full z-40"
            gravity={0.5}
            recycle={false}
            numberOfPieces={500}
          />
          <div className="from-green-400/90 to-green-200/60 bg-gradient-to-b rounded-lg z-50 flex flex-col w-[20%] h-[55%] items-center justify-between p-5 border border-absoluteBlack">
            <span className="font-bold text-2xl items-center">You Won!</span>
            <span className="items-center justify-self-center">
              You actually made it...
            </span>
            <img
              src={`data:image/png;base64,${finishedGame.nonogram.completeNonogramImageBase64}`}
              alt="complete game preview"
              className="w-[90%]"
            />
            {!reacted && (
              <div className="flex flex-col gap-5 items-center w-full">
                <span>Did you like this nonogram?*</span>
                <div className="flex flex-row gap-5 items-center justify-around w-full">
                  <button
                    className="border border-absoluteBlack w-1/3 h-8 rounded-md bg-absoluteWhite/30"
                    onClick={() => {
                      onLikeClick();
                      setReacted(true);
                    }}
                  >
                    Yes! 👍
                  </button>
                  <button
                    className="border border-absoluteBlack w-1/3 h-8 rounded-md bg-absoluteWhite/30"
                    onClick={() => setReacted(true)}
                  >
                    No :(
                  </button>
                </div>
              </div>
            )}
            {reacted && (
              <button
                className="enabled:hover:scale-105 enabled:active:scale-95 enabled:transition-transform disabled:bg-gray-400 disabled:cursor-not-allowed border border-absoluteBlack p-2 rounded-lg bg-absoluteWhite/70 shadow-xl"
                disabled={!reacted}
                onClick={() => navigate('/home', { replace: true })}
              >
                Home
              </button>
            )}
          </div>
        </div>
      )}

      {gameStatus === GameStatus.LOST && (
        <div className="from-red-400/90 to-red-300/80 bg-gradient-to-b rounded-lg z-50 flex flex-col w-[20%] h-[30%] items-center justify-between p-5 border border-absoluteBlack">
          <span className="font-bold text-2xl items-center">You Lost!</span>
          <span className="items-center justify-self-center text-xl">
            Better luck next time
          </span>
          <button
            className="hover:scale-105 active:scale-95 transition-transform border border-absoluteBlack p-2 rounded-lg bg-absoluteWhite/70 shadow-xl"
            onClick={() => navigate('/home', { replace: true })}
          >
            Home
          </button>
        </div>
      )}
    </div>
  );
};
