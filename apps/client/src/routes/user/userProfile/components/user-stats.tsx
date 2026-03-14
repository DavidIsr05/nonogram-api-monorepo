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
        <span>🎨 Nonograms created: {nonogramsCreated}</span>
        <span>🎮 Games played: {gamesPlayed}</span>
        <span>✅ Nonograms complete: {nonogramsComplete}</span>
        <span>👍 Nonograms Liked: {nonogramsLiked}</span>
        <span>⏳ Average time: {averageTimer}</span>
      </div>
    </div>
  );
};
