import React from 'react';
import { Trophy } from '../../../assets';
import { useGetNonogramLeadersQuery } from '../../../store/api';
import { LoadingState, ErrorState } from '../../../components';
import {
  TOP_THREE_COLORFUL_BACKGROUND,
  POSITION_SYMBOLS,
} from '../../../constants';
import { formatTime } from '../../../utils';
import { cn } from '@nonogram-api-monorepo/ui';

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

  if (!nonogramLeaders) {
    return null;
  }

  const leaders = nonogramLeaders[0] ? (
    nonogramLeaders.map(({ timer, user }, position) => {
      const positionSymbol = POSITION_SYMBOLS[position] ?? position + 1;

      const backgroundColor =
        TOP_THREE_COLORFUL_BACKGROUND[position] ?? 'bg-absoluteWhite/40';

      return (
        <li
          className={cn(
            'h-[7%] flex flex-row items-center justify-between p-5 rounded-xl shadow-lg backdrop-blur-lg',
            backgroundColor
          )}
          key={position}
        >
          <div className="text-sm md:text-xl">{positionSymbol}</div>
          <div className="text-base md:text-2xl">{user.username}</div>
          <span
            className="text-sm xl:text-xl"
            role="img"
            aria-label="timer emoji"
          >
            ⏱️: {formatTime(timer)}
          </span>
        </li>
      );
    })
  ) : (
    <li
      className="items-center justify-self-center text-3xl text-absoluteBlack/40"
      key={'empty'}
    >
      Be the first one in here!
    </li>
  );

  return (
    <div className="mt-28 2xl:mt-10 flex flex-col h-[80%] 2xl:h-[90%] w-[20%] border items-center bg-globalLeaderboards rounded-xl shadow-xl">
      <Trophy className="aspect-square m-7" />
      <ul className="list-inside w-[95%] h-[81%] space-y-4 overflow-auto">
        {leaders}
      </ul>
    </div>
  );
};
