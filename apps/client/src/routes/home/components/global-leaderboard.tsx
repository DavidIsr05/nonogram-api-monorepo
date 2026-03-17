import React from 'react';
import { Trophy } from '../../../assets';
import { useGetGlobalLeadersQuery } from '../../../store/api';
import { LoadingState, ErrorState } from '../../../components';
import {
  TOP_THREE_COLORFUL_BACKGROUND,
  POSITION_SYMBOLS,
} from '../../../constants';

export const GlobalLeaderboard: React.FC = () => {
  const { data: globalLeaders, isLoading, error } = useGetGlobalLeadersQuery();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!globalLeaders) {
    return null;
  }

  const leaders = globalLeaders[0] ? (
    globalLeaders.map(({ username, score }, position) => {
      const positionSymbol = POSITION_SYMBOLS[position] ?? position + 1;

      const backgroundColor =
        TOP_THREE_COLORFUL_BACKGROUND[position] ?? 'bg-absoluteWhite/40 h-[7%]';

      return (
        <li
          className={`mb-5 flex flex-row items-center justify-between p-5 rounded-xl shadow-lg backdrop-blur-lg ${backgroundColor}`}
          key={position}
        >
          <div className="text-xl">{positionSymbol}</div>
          <div className="text-2xl">{username}</div>
          <span className="text-xl" role="img" aria-label="score emoji">
            🌟: {score}
          </span>
        </li>
      );
    })
  ) : (
    <li className="items-center justify-self-center" key={'empty'}>
      Be the first one!
    </li>
  );

  return (
    <div className="flex flex-col h-[95%] w-[30%] border items-center bg-globalLeaderboardsBackground rounded-xl shadow-xl">
      <Trophy className="aspect-square m-5" />
      <ul className="list-inside w-[95%] h-[80%]">{leaders}</ul>
    </div>
  );
};
