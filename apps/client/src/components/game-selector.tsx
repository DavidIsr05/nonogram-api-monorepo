import { NonogramDifficultiesEnumType } from '@nonogram-api-monorepo/types';
import React, { ReactNode, useState } from 'react';
import { DifficultyFilter } from './difficulty-filter';

type Props = {
  name: string;
  renderList: (difficulty: NonogramDifficultiesEnumType | null) => ReactNode;
  NonogramCreationPopup: React.FC | null;
};

export const GameSelector: React.FC<Props> = ({
  name,
  renderList,
  NonogramCreationPopup,
}) => {
  const [difficultyFilter, setDifficultyFilter] =
    useState<NonogramDifficultiesEnumType | null>(null);

  return (
    <div className="h-[95%] w-[60%] border p-5 text-4xl rounded-xl bg-gameSelectorBackground/60 shadow-lg">
      <div className="grid grid-cols-[1fr_1fr_1fr]">
        <span className="font-medium">{name}</span>
        <div className="justify-self-center">
          <DifficultyFilter
            setDifficultyFilter={setDifficultyFilter}
            difficultyFilter={difficultyFilter}
          />
        </div>
        <ul className="justify-self-end">
          {NonogramCreationPopup ? (
            <li>
              <NonogramCreationPopup />
            </li>
          ) : (
            <li />
          )}
        </ul>
      </div>
      {renderList(difficultyFilter)}
    </div>
  );
};
