import { NonogramDifficultiesEnumType } from '@nonogram-api-monorepo/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../../store/store';
import { useGetInProgresGamesQuery } from '../../../../store/api';
import { DIFFICULTY_SIZE } from '../../../../constants';
import { LoadingState, ErrorState } from '../../../../components';
import { formatTime } from '../../../../utils';

type Props = {
  difficulty: NonogramDifficultiesEnumType | null;
};

export const GameList: React.FC<Props> = ({ difficulty }) => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const navigate = useNavigate();

  const {
    data: games,
    isLoading,
    isError,
    error,
  } = useGetInProgresGamesQuery(userId ?? '', { skip: !userId });

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState error={error} />;
  }

  const handleGameClick = (gameId: string) => {
    navigate(`/game/${gameId}`);
    return null;
  };

  const filteredGames = difficulty
    ? games?.filter((game) => game.nonogram.difficulty === difficulty)
    : games;

  return (
    <ul className="flex flex-col gap-2 overflow-y-auto max-h-[93%] pb-2">
      {filteredGames && filteredGames.length > 0 ? (
        filteredGames.map(({ id, nonogram, timer, mistakes }) => (
          <li
            key={id}
            className="cursor-pointer grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center shadow-md rounded-lg p-4 backdrop-blur-lg bg-absoluteWhite/30 text-lg"
            onClick={() => handleGameClick(id)}
          >
            <span className="text-center font-bold">{nonogram.name}</span>
            <span className="text-dividorGray">|</span>
            <span className="text-center" role="img" aria-label="timer emoji">
              ⏱️ : {formatTime(timer)}
            </span>
            <span className="text-dividorGray">|</span>
            <span
              className="text-center"
              role="img"
              aria-label="mistakes emoji"
            >
              ❌ : {mistakes}/3
            </span>
            <span className="text-dividorGray">|</span>
            <span className="text-center" role="img" aria-label="size emoji">
              📐 : {DIFFICULTY_SIZE[nonogram.difficulty]}
            </span>
          </li>
        ))
      ) : (
        <li className="text-center text-absoluteBlack/40">Go play sum</li>
      )}
    </ul>
  );
};
