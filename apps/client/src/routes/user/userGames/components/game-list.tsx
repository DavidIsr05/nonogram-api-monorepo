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
    <ul className="flex flex-col gap-2 overflow-y-auto max-h-[93%] pb-2">
      {filteredGames?.map(({ id, nonogram, timer, mistakes, hints }) => (
        <li
          key={id}
          className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] items-center shadow-md rounded-lg p-4 backdrop-blur-lg bg-absoluteWhite/30 text-lg"
        >
          <span className="text-center font-bold">{nonogram.name}</span>
          <span className="text-dividorGray">|</span>
          <span className="text-center">⏱️ : {timer}</span>
          {/* //TODO need to fix time/format */}
          <span className="text-dividorGray">|</span>
          <span className="text-center">❌ : {mistakes}/3</span>
          <span className="text-dividorGray">|</span>
          <span className="text-center">💡 : {3 - hints}/3</span>
          <span className="text-dividorGray">|</span>
          <span className="text-center">
            📐 {DIFFICULTY_SIZE[nonogram.difficulty]}
          </span>
        </li>
      ))}
    </ul>
  );
};
