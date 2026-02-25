import { NonogramDifficultiesEnumType } from '@nonogram-api-monorepo/types';
import React, { useState } from 'react';
import { DifficultyFilter } from './difficulty-filter';

export const BigContainer: React.FC = () => {
  const [difficultyFilter, setDifficultyFilter] =
    useState<NonogramDifficultiesEnumType | null>(null);

  return (
    <DifficultyFilter
      setDifficultyFilter={setDifficultyFilter}
      difficultyFilter={difficultyFilter}
    />
  );
};
