import { NonogramDifficultiesEnumType } from '@nonogram-api-monorepo/types';
import React, { SetStateAction, useState } from 'react';
import { DifficultyFilter } from './difficulty-filter';

export const gameSelector: React.FC = () => {
  const [difficultyFilter, setDifficultyFilter] =
    useState<SetStateAction<NonogramDifficultiesEnumType> | null>(null);

  return (
    <DifficultyFilter
      setDifficultyFilter={setDifficultyFilter}
      difficultyFilter={difficultyFilter}
    />
  );
};
