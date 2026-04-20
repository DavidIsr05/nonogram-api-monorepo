import React from 'react';
import { Star } from '../assets';
import {
  NonogramDifficultiesEnumType,
  NonogramDifficultiesEnumValues,
} from '@nonogram-api-monorepo/types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@nonogram-api-monorepo/ui-kit';

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
    <div className="flex gap-2 flex-row pb-5">
      {Object.values(NonogramDifficultiesEnumValues.enum).map(
        (difficultyValue, difficultyIndex) => (
          <button
            className="aspect-square w-[2rem] md:w-[3rem] hover:scale-105 active:scale-95 transition-transform"
            onClick={() => {
              handleClick(difficultyValue);
            }}
            type="button"
            key={difficultyIndex}
          >
            <Tooltip>
              <TooltipTrigger>
                <Star
                  className={`w-full h-full ${getStarColor(difficultyIndex)}`}
                />
              </TooltipTrigger>
              <TooltipContent>{difficultyValue}</TooltipContent>
            </Tooltip>
          </button>
        )
      )}
    </div>
  );
};
