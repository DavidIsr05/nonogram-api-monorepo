import React from 'react';
import StarSvg from '../assets/images/star.svg?react';
import {
  NonogramDifficultiesEnumType,
  NonogramDifficultiesEnumValues,
} from '@nonogram-api-monorepo/types';

type Props = {
  setDifficultyFilter: (
    difficultyEnum: NonogramDifficultiesEnumType | null
  ) => void;
  difficultyFilter: NonogramDifficultiesEnumType | null;
};

export const DifficultyFilter: React.FC<Props> = ({
  setDifficultyFilter,
  difficultyFilter,
}) => {
  const getStarColor = (starIndex: number) => {
    if (difficultyFilter) {
      return starIndex >
        Object.values(NonogramDifficultiesEnumValues.enum).indexOf(
          difficultyFilter
        )
        ? 'fill-absoluteWhite/30'
        : 'fill-filledDifficultyStar';
    } else {
      return 'fill-absoluteWhite/30';
    }
  };

  const handleClick = (clickedDifficulty: NonogramDifficultiesEnumType) => {
    if (clickedDifficulty === difficultyFilter) {
      setDifficultyFilter(null);
    } else {
      setDifficultyFilter(clickedDifficulty);
    }
  };

  return (
    <div className="flex gap-2 flex-row">
      {Object.values(NonogramDifficultiesEnumValues.enum).map(
        (difficultyValue, difficultyIndex) => (
          <button
            className="aspect-square w-[3rem]"
            onClick={() => {
              handleClick(difficultyValue);
            }}
            type="button"
            key={difficultyIndex}
          >
            <StarSvg
              className={`w-full h-full ${getStarColor(difficultyIndex)}`}
            />
          </button>
        )
      )}
    </div>
  );
};
