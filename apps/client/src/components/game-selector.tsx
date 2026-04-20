import { NonogramDifficultiesEnumType } from '@nonogram-api-monorepo/types';
import React, { ReactNode, useState } from 'react';
import { DifficultyFilter } from './difficulty-filter';

type Props = {
  name: string;
  renderList: (difficulty: NonogramDifficultiesEnumType | null) => ReactNode;
  children: ReactNode;
  NonogramCreationPopup: React.FC | null;
};

export const GameSelector: React.FC<Props> = ({
  name,
  renderList,
  children,
  NonogramCreationPopup,
}) => {
  const [difficultyFilter, setDifficultyFilter] =
    useState<NonogramDifficultiesEnumType | null>(null);

  return (
    <div className="h-[95%] w-[80%] lg:w-[60%] border p-5 text-4xl rounded-xl bg-gameSelectorBackground/60 shadow-lg flex flex-col">
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
      {children}
      {renderList(difficultyFilter)}
    </div>
  );
};
