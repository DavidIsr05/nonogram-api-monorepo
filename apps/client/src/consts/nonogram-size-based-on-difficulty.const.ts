import {
  NonogramDifficulties,
  NonogramDifficultiesEnumType,
} from '@nonogram-api-monorepo/types';

export const DIFFICULTY_SIZE: Record<NonogramDifficultiesEnumType, string> = {
  [NonogramDifficulties.EASY]: '20x20',
  [NonogramDifficulties.MEDIUM]: '30x30',
  [NonogramDifficulties.HARD]: '40x40',
};
