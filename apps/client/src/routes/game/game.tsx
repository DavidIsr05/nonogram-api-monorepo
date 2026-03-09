import React from 'react';
import { ErrorState, Header, LoadingState } from '../../components';
import { useGetGameByIdQuery } from '../../store/api';
import { useParams } from 'react-router-dom';
import { NonogramLeaderboard } from './components';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export const Game: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();

  if (!gameId) {
    return <LoadingState />; //TODO
  }

  const { data: gameData, isLoading, error } = useGetGameByIdQuery(gameId);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="w-screen h-screen bg-graishWhiteBackground items-center flex flex-col">
      <Header />
      GAME
      <div className="h-[90%] w-full">
        <NonogramLeaderboard nonogramId={gameData!.nonogramId} />
      </div>
    </div>
  );
};
