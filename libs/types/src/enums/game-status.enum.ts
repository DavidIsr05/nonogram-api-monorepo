import { z } from 'zod';

export enum GameStatus {
  LOST = 'LOST',
  WON = 'WON',
  FINE = 'FINE',
}

export const GameStatusEnumValues = z.nativeEnum(GameStatus);

export type GameStatusEnumType = z.infer<typeof GameStatusEnumValues>;
