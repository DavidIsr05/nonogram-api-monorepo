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
    <div className="h-[95%] w-[60%] border p-3 text-4xl rounded-xl bg-gameSelectorBackground">
      <div className="justify-between flex flex-row">
        {name}
        <DifficultyFilter //TODO difficulty filter is not really centered because of name lenght idk need QA
          setDifficultyFilter={setDifficultyFilter}
          difficultyFilter={difficultyFilter}
        />
        <ul>
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
