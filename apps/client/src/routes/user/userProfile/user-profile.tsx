import { ErrorState, Header, LoadingState } from '../../../components';
import React from 'react';
import { UserInfo, UserStats } from './components';
import { RootState } from '../../../store/store';
import { useSelector } from 'react-redux';
import { useGetUserByIdQuery, useGetUserStatsQuery } from '../../../store/api';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';

export const UserProfile: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const navigate = useNavigate();

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

  if (!userId) {
    navigate('/', { replace: true });
    return null;
  }

  if (isUserDataLoading || isUserStatsLoading) {
    return <LoadingState />;
  }

  if (isErrorWhileFetchingUserData) {
    return <ErrorState error={userDataError} />;
  } else if (isErrorWhileFetchingUserStats) {
    return <ErrorState error={userStatsError} />;
  }

  return (
    <div className="w-screen h-screen bg-lightGrayBackground">
      <Header />
      <div className="h-[91%] w-[95%] justify-self-center flex flex-col items-center justify-around">
        <div className="flex flex-row w-[90%] h-[40%]">
          <UserInfo {...userData!} />
          <UserStats {...userStats!} />
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
};
