import { GameStatus } from '@nonogram-api-monorepo/types';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useGetFinishedGameQuery } from '../../../store/api';
import { ErrorState, LoadingState } from '../../../components';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@nonogram-api-monorepo/ui-kit';

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
  } = useGetFinishedGameQuery(gameId, { skip: gameStatus === GameStatus.LOST });

  if (gameStatus === GameStatus.WON && isErrorWhileFetchingFinishedGame) {
    return <ErrorState error={finishedGameError} />;
  }

  if (gameStatus === GameStatus.WON && isFinishedGameLoading) {
    return <LoadingState />;
  }

  if (gameStatus === GameStatus.WON && !finishedGame) {
    return null;
  }

  return (
    <Dialog open={true}>
      {gameStatus === GameStatus.WON && (
        <>
          <Confetti
            className="z-40"
            gravity={0.5}
            recycle={false}
            numberOfPieces={500}
          />
          <DialogContent
            className="from-green-400/90 to-green-200/60 bg-gradient-to-b ring-absoluteBlack"
            showCloseButton={false}
            onEscapeKeyDown={(e) => e.preventDefault()}
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <DialogHeader className="items-center">
              <span className="font-bold text-2xl">You Won!</span>
            </DialogHeader>
            <span className="justify-self-center">You actually made it...</span>
            <img
              src={`data:image/png;base64,${
                finishedGame!.nonogram.completeNonogramImageBase64
              }`}
              alt="complete game preview"
              className="w-[90%] justify-self-center"
            />
            <DialogFooter className="border-t-absoluteBlack/30">
              {!reacted && (
                <div className="flex flex-col gap-5 items-center w-full">
                  <span>Did you like this nonogram?*</span>
                  <div className="flex flex-row gap-5 items-center justify-around w-full">
                    <Button
                      className="border border-absoluteBlack rounded-md bg-absoluteWhite/30"
                      onClick={() => {
                        onLikeClick();
                        setReacted(true);
                      }}
                    >
                      <span role="img" aria-label="thumbs up">
                        Yes! 👍
                      </span>
                    </Button>
                    <Button
                      className="border border-absoluteBlack rounded-md bg-absoluteWhite/30"
                      onClick={() => setReacted(true)}
                    >
                      No :(
                    </Button>
                  </div>
                </div>
              )}
              {reacted && (
                <Button
                  className="hover:scale-105 active:scale-95 transition-transform border border-absoluteBlack p-2 rounded-lg bg-absoluteWhite/70 shadow-xl"
                  onClick={() => navigate('/home', { replace: true })}
                >
                  Home
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </>
      )}

      {gameStatus === GameStatus.LOST && (
        <DialogContent
          showCloseButton={false}
          className="from-red-400/90 to-red-300/80 bg-gradient-to-b ring-absoluteBlack"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="items-center">
            <span className="font-bold text-2xl">You Lost!</span>
          </DialogHeader>
          <span className="justify-self-center text-xl">
            Better luck next time
          </span>
          <DialogFooter className="border-t-absoluteBlack/30">
            <Button
              className="hover:scale-105 active:scale-95 transition-transform border border-absoluteBlack p-2 rounded-lg bg-absoluteWhite/70 shadow-xl"
              onClick={() => navigate('/home', { replace: true })}
            >
              Home
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};
