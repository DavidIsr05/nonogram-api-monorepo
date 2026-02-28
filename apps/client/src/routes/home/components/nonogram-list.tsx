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
    <ul className="flex flex-col gap-2">
      {filteredNonograms?.map((nonogram) => (
        <li
          key={nonogram.id}
          className="flex flex-col border rounded-lg p-3 gap-1"
        >
          <div className="text-lg font-bold">{nonogram.name}</div>
          <div className="gap-4 text-sm">
            <>📐 {DIFFICULTY_SIZE[nonogram.difficulty]}</>
            {/* will be more then 1 div inside.... no cr comment needed */}
          </div>
        </li>
      ))}
    </ul>
  );
};
