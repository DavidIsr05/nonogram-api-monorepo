import React from 'react';
import trophy from '../../../assets/images/trophy.svg';
import { useGetGlobalLeadersQuery } from '../../../store/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const GlobalLeaderboard: React.FC = () => {
  const { data, isLoading, error } = useGetGlobalLeadersQuery();

  const navigate = useNavigate();

  if (error && 'status' in error && error.status === 401) {
    navigate('/', { replace: true });
  }

  if (isLoading) {
    return <>LOADING</>;
  }

  const leaders = data?.map((arr, index) => {
    const position = index + 1;
    let positionSymbol = null;

    switch (position) {
      case 1:
        positionSymbol = '🥇';
        break;
      case 2:
        positionSymbol = '🥈';
        break;
      case 3:
        positionSymbol = '🥉';
        break;
      default:
        positionSymbol = position;
    }

    return (
      <li
        className="h-[7%] mb-7 border flex flex-row items-center justify-between p-5 rounded-xl shadow-lg bg-[#FFFFFF]"
        key={position}
      >
        <div className="text-xl">{positionSymbol}</div>
        <div className="text-2xl">{arr[0]}</div>
        <div className="text-xl">🌟: {arr[1]}</div>
      </li>
    );
  });

  return (
    <div className="flex flex-col h-[95%] w-[30%] border ml-6 mt-6 items-center bg-[#F4E1C6] rounded-xl shadow-xl">
      <img src={trophy} className="aspect-square w-[10%rem] m-7" />
      <ul className="list-inside w-[95%] h-[80%]">{leaders}</ul>
    </div>
  );
};
