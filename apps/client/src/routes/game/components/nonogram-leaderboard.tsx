import React from 'react';
import { Trophy } from '../../../assets';
import { useGetNonogramLeadersQuery } from '../../../store/api';
import { LoadingState, ErrorState } from '../../../components';
import {
  TOP_THREE_COLORFUL_BACKGROUND,
  POSITION_SYMBOLS,
} from '../../../constants';

type Props = {
  nonogramId: string;
};

export const NonogramLeaderboard: React.FC<Props> = ({ nonogramId }) => {
  const {
    data: nonogramLeaders,
    isLoading,
    error,
  } = useGetNonogramLeadersQuery(nonogramId);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const leaders = nonogramLeaders ? (
    nonogramLeaders.games.map(({ timer, user }, position) => {
      const positionSymbol = POSITION_SYMBOLS[position] ?? position + 1;

      const backgroundColor =
        TOP_THREE_COLORFUL_BACKGROUND[position] ?? 'bg-absoluteWhite/40';

      return (
        <li
          className={`h-[7%] mb-7 flex flex-row items-center justify-between p-5 rounded-xl shadow-lg backdrop-blur-lg ${backgroundColor}`}
          key={position}
        >
          <div className="text-xl">{positionSymbol}</div>
          <div className="text-2xl">{user.username}</div>
          <span className="text-xl" role="img" aria-label="timer emoji">
            ⏱️: {formatTime(timer)}
          </span>
        </li>
      );
    })
  ) : (
    <li className="items-center justify-self-center" key={'empty'}>
      Be the first one in here!
    </li>
  );

  return (
    <div className="flex flex-col h-[90%] w-[20%] border items-center bg-globalLeaderboardsBackground rounded-xl shadow-xl">
      <Trophy className="aspect-square m-7" />
      <ul className="list-inside w-[95%] h-[80%]">{leaders}</ul>
    </div>
  );
};
