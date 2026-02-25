import React, { SetStateAction } from 'react';
import StarSvg from '../assets/images/blankStar.svg?react';
import {
  NonogramDifficultiesEnumType,
  NonogramDifficultiesEnumValues,
} from '@nonogram-api-monorepo/types';

type Props = {
  setDifficultyFilter: (
    difficultyEnum: SetStateAction<NonogramDifficultiesEnumType> | null
  ) => void;
  difficultyFilter: SetStateAction<NonogramDifficultiesEnumType> | null;
};

export const DifficultyFilter: React.FC<Props> = ({
  setDifficultyFilter,
  difficultyFilter,
}) => {
  const getStarColor = (starIndex: number) => {
    if (difficultyFilter) {
      return starIndex >
        Object.values(NonogramDifficultiesEnumValues.enum).indexOf(
          difficultyFilter as NonogramDifficultiesEnumType
        )
        ? 'fill-absoluteWhite'
        : 'fill-filledDifficultyStar';
    } else {
      return 'absoluteWhite';
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
    <div className="flex gap-1 flex-row">
      {Object.values(NonogramDifficultiesEnumValues.enum).map(
        (difficultyValue, difficultyIndex) => (
          <button
            className="transition-transform hover:scale-110"
            onClick={() => {
              handleClick(difficultyValue);
            }}
            type="button"
            key={difficultyIndex}
          >
            <StarSvg className={getStarColor(difficultyIndex)} />
          </button>
        )
      )}
    </div>
  );
};
