import React from 'react';
import StarSvg from '../assets/images/blankStar.svg?react';
import { NonogramDifficultiesEnumType, NonogramDifficultiesEnumValues } from '@nonogram-api-monorepo/types';

interface Props {
  setDifficultyFilter: (
    difficultyEnum: NonogramDifficultiesEnumType | null
  ) => void;
  difficultyFilter: NonogramDifficultiesEnumType | null;
}

export const DifficultyFilter: React.FC<Props> = ({
  setDifficultyFilter,
  difficultyFilter,
}) => {
  const getStarColor = (starIndex: number) => {
    if (difficultyFilter) {
      return starIndex >
        Object.keys(NonogramDifficultiesEnumValues.enum).indexOf(
          difficultyFilter
        )
        ? 'absoluteWhite'
        : 'filledDifficultyStar';
    }

    return 'absoluteWhite';
  };

  const handleClick = (clickedDifficulty: NonogramDifficultiesEnumType) => {
    if (clickedDifficulty === difficultyFilter) {
      setDifficultyFilter(null);
    } else {
      setDifficultyFilter(clickedDifficulty);
    }
  };

  return (
    <div className="flex gap-1">
      {Object.entries(NonogramDifficultiesEnumValues.enum).map(
        (difficultyValue, difficultyIndex) => (
          <button
            className="transition-transform hover:scale-110"
            onClick={() => {
              handleClick(difficultyValue[1]);
            }}
            type="button"
            key={difficultyIndex}
          >
            <StarSvg className={`fill-${getStarColor(difficultyIndex)}`} />
          </button>
        )
      )}
    </div>
  );
};
