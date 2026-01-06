import { z } from 'zod';

enum TileStates {
  EMPTY = 'EMPTY',
  FILLED = 'FILLED',
  HINT = 'HINT',
  MISTAKE = 'MISTAKE',
}

export const TileStatesEnumValues = z.nativeEnum(TileStates);
export type TileStatesEnumType = z.infer<typeof TileStatesEnumValues>;
