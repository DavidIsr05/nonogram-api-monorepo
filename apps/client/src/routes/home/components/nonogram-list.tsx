import { NonogramDifficultiesEnumType } from '@nonogram-api-monorepo/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { useGetUnplayedNonogramsQuery } from '../../../store/api';
import { RootState } from '../../../store/store';
import { DIFFICULTY_SIZE } from '../../../consts';

type Props = {
  difficulty: NonogramDifficultiesEnumType | null;
};

export const NonogramList: React.FC<Props> = ({ difficulty }) => {
  const userId = useSelector((state: RootState) => state.user.userId);

  const {
    data: nonograms,
    isLoading,
    isError,
  } = useGetUnplayedNonogramsQuery(userId ?? '', { skip: !userId });

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
        <li>Failed to load nonograms</li>
      </ul>
    );
  }

  const filteredNonograms = difficulty
    ? nonograms?.filter((nonogram) => nonogram.difficulty === difficulty)
    : nonograms;

  return (
    <ul className="flex flex-col gap-2 overflow-y-auto max-h-[93%] pb-2">
      {filteredNonograms?.map(
        ({ id, name, likeCount, gameCount, difficulty, user }) => (
          <li
            key={id}
            className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] items-center shadow-md rounded-lg p-4 backdrop-blur-lg bg-absoluteWhite/30 text-lg"
          >
            <span className="font-semibold text-center">{user?.username}</span>
            <span className="text-dividorGray">|</span>
            <span className="font-bold text-center">{name}</span>
            <span className="text-dividorGray">|</span>
            <span className="text-center">
              📐 {DIFFICULTY_SIZE[difficulty]}
            </span>
            <span className="text-dividorGray">|</span>
            <span className="text-center">👍 {likeCount}</span>
            <span className="text-dividorGray">|</span>
            <span className="text-center">🎮 {gameCount}</span>
          </li>
        )
      )}
    </ul>
  );
};
