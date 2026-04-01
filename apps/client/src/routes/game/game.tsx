import React from 'react';
import { ErrorState, Header, LoadingState } from '../../components';
import { useGetGameByIdQuery, useUpdateGameMutation } from '../../store/api';
import { useNavigate, useParams } from 'react-router-dom';
import { GameBoard, NonogramLeaderboard } from './components';
import { Like, Star } from '../../assets';
import { NonogramDifficultiesEnumValues } from '@nonogram-api-monorepo/types';
import { DIFFICULTY_SIZE } from '../../constants';

export const Game: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [updateGame] = useUpdateGameMutation();
  const navigate = useNavigate();

  const {
    data: gameData,
    isLoading: isGameDataLoading,
    error: errorFetchingGameData,
  } = useGetGameByIdQuery(gameId!, { skip: !gameId });

  if (!gameId) {
    navigate('/home', { replace: true });
    return;
  }

  if (isGameDataLoading) {
    return <LoadingState />;
  }

  if (errorFetchingGameData) {
    return <ErrorState error={errorFetchingGameData} />;
  }

  if (!gameData) {
    return null;
  }

  const onLikeClick = () => {
    const isLiked = gameData.isLiked;
    updateGame({ isLiked: !isLiked, id: gameId });
  };

  const getStarColor = (starIndex: number) => {
    return starIndex >
      Object.values(NonogramDifficultiesEnumValues.enum).indexOf(
        gameData.nonogramDifficulty
      )
      ? 'fill-absoluteWhite/30'
      : 'fill-filledDifficultyStar';
  };

  const likeButtonFill = gameData.isLiked
    ? 'fill-absoluteBlack/30'
    : 'fill-absoluteWhite';

  return (
    <div className="w-full h-screen bg-game bg-center bg-repeat items-center flex flex-col">
      <Header />
      <div className="relative w-full h-[91%] p-3">
        <div className="absolute top-3 left-10 right-10 flex flex-row items-center justify-between text-4xl z-10 pointer-events-none">
          <div className="flex flex-col 2xl:flex-row items-center gap-3 2xl:gap-10 text-xl xl:text-4xl">
            <span className="font-bold">{gameData.nonogramName}</span>
            <div className="flex flex-row">
              {Object.values(NonogramDifficultiesEnumValues.enum).map(
                (_, difficultyIndex) => (
                  <Star
                    className={`aspect-square w-[2rem] xl:w-[3rem] ${getStarColor(
                      difficultyIndex
                    )}`}
                    key={difficultyIndex}
                  />
                )
              )}
            </div>
          </div>
          <button
            onClick={onLikeClick}
            disabled={!gameData.isFinished}
            className="pointer-events-auto disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-transform"
          >
            <Like className={`${likeButtonFill}`} />
          </button>
        </div>
        <div className="h-full w-full p-3 flex flex-row">
          <NonogramLeaderboard nonogramId={gameData.nonogramId} />
          <GameBoard {...gameData} />
        </div>
      </div>
    </div>
  );
};
