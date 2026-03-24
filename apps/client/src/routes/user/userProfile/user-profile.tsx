import { ErrorState, Header, LoadingState } from '../../../components';
import React from 'react';
import { FinishedGames, UserInfo, UserStats } from './components';
import { RootState } from '../../../store/store';
import { useSelector } from 'react-redux';
import {
  useGetFinishedGamesQuery,
  useGetUserByIdQuery,
  useGetUserStatsQuery,
} from '../../../store/api';
import { Toaster } from 'sonner';

export const UserProfile: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.userId);

  const {
    data: userData,
    isLoading: isUserDataLoading,
    isError: isErrorWhileFetchingUserData,
    error: userDataError,
  } = useGetUserByIdQuery(userId!, { skip: !userId });

  const {
    data: userStats,
    isLoading: isUserStatsLoading,
    isError: isErrorWhileFetchingUserStats,
    error: userStatsError,
  } = useGetUserStatsQuery();

  const {
    data: finishedGames,
    isLoading: isFinishedGamesLoading,
    isError: isErrorWhileFetchingFinishedGames,
    error: finishedGamesError,
  } = useGetFinishedGamesQuery(userId!, { skip: !userId });

  if (isUserDataLoading || isUserStatsLoading || isFinishedGamesLoading) {
    return <LoadingState />;
  }

  if (isErrorWhileFetchingUserData) {
    return <ErrorState error={userDataError} />;
  } else if (isErrorWhileFetchingUserStats) {
    return <ErrorState error={userStatsError} />;
  } else if (isErrorWhileFetchingFinishedGames) {
    return <ErrorState error={finishedGamesError} />;
  }

  if (!userData || !userStats || !finishedGames) {
    return null;
  }

  return (
    <div className="w-screen h-screen bg-defaultBG bg-center bg-repeat">
      <Header />
      <div className="h-[91%] w-[95%] justify-self-center flex flex-col items-center justify-around">
        <div className="flex flex-row w-[90%] h-[50%] border rounded-2xl shadow-lg items-center bg-absoluteWhite/70">
          <UserInfo {...userData} />
          <UserStats {...userStats} />
        </div>
        <span>Finished Games: </span>
        <FinishedGames finishedGames={finishedGames} />
      </div>
      <Toaster richColors />
    </div>
  );
};
