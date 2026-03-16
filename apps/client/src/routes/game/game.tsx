import React from 'react';
import { ErrorState, Header, LoadingState } from '../../components';
import { useGetGameByIdQuery, useUpdateGameMutation } from '../../store/api';
import { useNavigate, useParams } from 'react-router-dom';
import { GameBoard, NonogramLeaderboard } from './components';
import { Like, Star } from '../../assets';
import { NonogramDifficultiesEnumValues } from '@nonogram-api-monorepo/types';

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

  const onLikeClick = () => {
    const isLiked = gameData?.isLiked;
    updateGame({ isLiked: !isLiked, id: gameId });
  };

  const getStarColor = (starIndex: number) => {
    return starIndex >
      Object.values(NonogramDifficultiesEnumValues.enum).indexOf(
        gameData!.nonogramDifficulty
      )
      ? 'fill-absoluteWhite/30'
      : 'fill-filledDifficultyStar';
  };

  const likeButtonFill = gameData?.isLiked
    ? 'fill-absoluteBlack/30'
    : 'fill-absoluteWhite';

  return (
    <div className="w-screen h-screen bg-lightGrayBackground items-center flex flex-col">
      <Header />
      <div className="flex flex-col w-full h-[91%] p-3">
        <div className="grid grid-cols-[1fr_1fr_1fr] w-full text-4xl px-10">
          <span className="font-bold">{gameData?.nonogramName}</span>
          <div className="flex flex-row justify-self-center">
            {Object.values(NonogramDifficultiesEnumValues.enum).map(
              (_, difficultyIndex) => (
                <Star
                  className={`aspect-square w-[3rem] ${getStarColor(
                    difficultyIndex
                  )}`}
                  key={difficultyIndex}
                />
              )
            )}
          </div>
          <button
            onClick={onLikeClick}
            disabled={!gameData?.isFinished}
            className="disabled:opacity-40 disabled:cursor-not-allowed justify-self-end"
          >
            <Like className={`${likeButtonFill}`} />
          </button>
        </div>
        <div className="h-[95%] w-full p-3 flex flex-row ">
          <NonogramLeaderboard nonogramId={gameData!.nonogramId} />
          <GameBoard {...gameData!} gameId={gameId} />
        </div>
      </div>
    </div>
  );
};
