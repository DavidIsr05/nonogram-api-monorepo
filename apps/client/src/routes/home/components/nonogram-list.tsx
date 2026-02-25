import { NonogramDifficultiesEnumType } from '@nonogram-api-monorepo/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { useGetUnplayedNonogramsQuery } from '../../../store/api';
import { RootState } from '../../../store/store';

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

  console.log({ userId, nonograms, isLoading, isError });

  if (!userId)
    return (
      <ul>
        <li>Not logged in</li>
      </ul>
    );

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
    <ul>
      {filteredNonograms?.map((nonogram) => (
        <li key={nonogram.id}>{nonogram.id}</li> //TODO finish this
      ))}
    </ul>
  );
};
