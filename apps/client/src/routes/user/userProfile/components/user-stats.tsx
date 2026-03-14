import { UserStatsType } from '@nonogram-api-monorepo/types';
import React from 'react';

type Props = UserStatsType;

export const UserStats: React.FC<Props> = ({
  nonogramsCreated,
  gamesPlayed,
  averageTimer,
  nonogramsLiked,
  nonogramsComplete,
}) => {
  return (
    <div className="flex flex-col items-center h-full w-[50%] gap-5 text-xl">
      <span className="text-2xl">Stats:</span>
      <div className="flex flex-col items-start gap-5">
        <span role="img" aria-label="Nonograms created">
          🎨 Nonograms created: {nonogramsCreated}
        </span>
        <span role="img" aria-label="Games played">
          🎮 Games played: {gamesPlayed}
        </span>
        <span role="img" aria-label="Nonograms complete">
          ✅ Nonograms complete: {nonogramsComplete}
        </span>
        <span role="img" aria-label="Nonograms Liked">
          👍 Nonograms Liked: {nonogramsLiked}
        </span>
        <span role="img" aria-label="average time">
          ⏳ Average time: {averageTimer}
        </span>
      </div>
    </div>
  );
};
