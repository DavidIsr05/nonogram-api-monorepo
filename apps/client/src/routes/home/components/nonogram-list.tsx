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
    <ul className="flex flex-col gap-2 overflow-y-scroll max-h-[93%]">
      {filteredNonograms?.map(
        ({ id, name, likeCount, gameCount, difficulty, user }) => (
          <li
            key={id}
            className="flex flex-col shadow-lg rounded-xl p-5 gap-1 backdrop-blur-lg bg-absoluteWhite/30"
          >
            <div className="text-xl font-bold">{name}</div>
            <div className="text-lg flex flex-row justify-around">
              <div className="flex flex-col">
                <span>👍 Likes: {likeCount}</span>
                <span>🎮 Game count: {gameCount}</span>
              </div>
              <div className="flex flex-col">
                <span>👨‍🎨 Creator: {user?.username}</span>
                <span>📐 {DIFFICULTY_SIZE[difficulty]}</span>
              </div>
            </div>
          </li>
        )
      )}
    </ul>
  );
};
