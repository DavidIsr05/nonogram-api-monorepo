import { NonogramDifficultiesEnumType } from '@nonogram-api-monorepo/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { useGetInProgresGamesQuery } from '../../../../store/api';
import { DIFFICULTY_SIZE } from '../../../../consts';

type Props = {
  difficulty: NonogramDifficultiesEnumType | null;
};

export const GameList: React.FC<Props> = ({ difficulty }) => {
  const userId = useSelector((state: RootState) => state.user.userId);

  const {
    data: games,
    isLoading,
    isError,
  } = useGetInProgresGamesQuery(userId ?? '', { skip: !userId });

  if (!userId) {
    return (
      <ul>
        <li>Not logged in</li>
      </ul>
    );
  }

  if (isLoading) {
    return (
      <ul>
        <li>Loading...</li>
      </ul>
    );
  }

  if (isError) {
    return (
      <ul>
        <li>Failed to load games</li>
      </ul>
    );
  }

  const filteredGames = difficulty
    ? games?.filter((game) => game.nonogram.difficulty === difficulty)
    : games;

  return (
    <ul className="flex flex-col gap-2 overflow-y-auto max-h-[93%]">
      {filteredGames?.map((game) => (
        <li
          key={game.id}
          className="flex flex-col shadow-lg rounded-xl p-5 gap-1 backdrop-blur-lg bg-absoluteWhite/30"
        >
          <div className="text-xl font-bold">{game.nonogram.name}</div>
          <div className="text-lg flex flex-row justify-around">
            <div className="flex flex-col">
              <span>⏱️ Time: {game.timer}</span>
              {/* //TODO need to fix time/format */}
              <span>❌ Mistakes: {game.mistakes}/3</span>
            </div>
            <div className="flex flex-col">
              <span>💡 Hints: {3 - game.hints}/3</span>
              <span>📐 {DIFFICULTY_SIZE[game.nonogram.difficulty]}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
