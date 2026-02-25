import React from 'react';
import trophy from '../../../assets/images/trophy.svg';
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

  const positionSymbols = ['🥇', '🥈', '🥉'];

  const leaders = globalLeaders.map(({ username, score }, position) => {
    const positionSymbol = positionSymbols[position]
      ? positionSymbols[position]
      : position + 1;

    return (
      <li
        className="h-[7%] mb-7 border flex flex-row items-center justify-between p-5 rounded-xl shadow-lg bg-absoluteWhite"
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
      <img
        src={trophy}
        className="aspect-square w-[10%rem] m-7"
        alt="trophy icon"
      />
      <ul className="list-inside w-[95%] h-[80%]">{leaders}</ul>
    </div>
  );
};
