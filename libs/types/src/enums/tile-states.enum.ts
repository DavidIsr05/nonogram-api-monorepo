import { z } from 'zod';

export enum TileStates {
  EMPTY = 'EMPTY',
  FILLED = 'FILLED',
  MISTAKE = 'MISTAKE',
  MARKED = 'MARKED',
}

export const TileStatesEnumValues = z.nativeEnum(TileStates);

export type TileStatesEnumType = z.infer<typeof TileStatesEnumValues>;
