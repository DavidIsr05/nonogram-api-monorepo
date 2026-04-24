import { z } from 'zod';

export enum NonogramDifficulties {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export const NonogramDifficultiesEnumValues =
  z.nativeEnum(NonogramDifficulties);

export type NonogramDifficultiesEnumType = z.infer<
  typeof NonogramDifficultiesEnumValues
>;
