import { NonogramDifficultiesEnumType } from '@nonogram-api-monorepo/types';
import React, { ReactNode, SetStateAction, useState } from 'react';
import { DifficultyFilter } from './difficulty-filter';

type Props = {
  name: string;
  renderList: (difficulty: NonogramDifficultiesEnumType | null) => ReactNode;
  Component: React.FC | null;
};

export const GameSelector: React.FC<Props> = ({
  name,
  renderList,
  Component,
}) => {
  const [difficultyFilter, setDifficultyFilter] =
    useState<SetStateAction<NonogramDifficultiesEnumType> | null>(null);

  const Header = ({ Component }: { Component: React.FC | null }) => {
    if (Component) {
      return (
        <li>
          <Component />
        </li>
      );
    } else {
      return <li />;
    }
  };

  return (
    <div className="h-[95%] w-[60%] border p-3 text-4xl">
      <div className="justify-between flex flex-row">
        {name}
        <DifficultyFilter
          setDifficultyFilter={setDifficultyFilter}
          difficultyFilter={difficultyFilter}
        />
        <ul>
          <Header Component={Component} />
        </ul>
      </div>
      {renderList(difficultyFilter)}
    </div>
  );
};
