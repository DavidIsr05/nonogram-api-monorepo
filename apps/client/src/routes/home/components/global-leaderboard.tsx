import React from 'react';
import { Trophy } from '../../../assets/images';
import { useGetGlobalLeadersQuery } from '../../../store/api';
import { useNavigate } from 'react-router-dom';

export const GlobalLeaderboard: React.FC = () => {
  const { data, isLoading, error } = useGetGlobalLeadersQuery();

  const navigate = useNavigate();

  if (error && 'status' in error && error.status === 401) {
    navigate('/', { replace: true });
  }

  if (isLoading) {
    return <>LOADING</>;
  }

  const globalLeaders: Record<string, number>[] = data!;

  const topThreeLeadersColorfulBackgrounds = [
    'bg-firstPlaceGoldBackground/40',
    'bg-secondPlaceSilverBackground/40',
    'bg-thirdPlaceBronzeBackground/40',
  ];
  const positionSymbols = ['🥇', '🥈', '🥉'];

  const leaders = globalLeaders.map(({ username, score }, position) => {
    const positionSymbol = positionSymbols[position] ?? position + 1;

    const backgroundColor =
      topThreeLeadersColorfulBackgrounds[position] ?? 'bg-absoluteWhite/40';

    return (
      <li
        className={`h-[7%] mb-7 flex flex-row items-center justify-between p-5 rounded-xl shadow-lg backdrop-blur-lg ${backgroundColor}`}
        key={position}
      >
        <div className="text-xl">{positionSymbol}</div>
        <div className="text-2xl">{username}</div>
        <div className="text-xl">🌟: {score}</div>
      </li>
    );
  });

  return (
    <div className="flex flex-col h-[95%] w-[30%] border items-center bg-globalLeaderboardsBackground rounded-xl shadow-xl">
      <Trophy className="aspect-square m-7" />
      <ul className="list-inside w-[95%] h-[80%]">{leaders}</ul>
    </div>
  );
};
