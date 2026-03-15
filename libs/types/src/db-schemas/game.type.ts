import { z } from 'zod';
import { TileStates } from '../enums';

export const GameSchema = z
  .object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    nonogramId: z.string().uuid(),
    uncompletedNonogram: z.array(z.array(z.nativeEnum(TileStates))).nullable(),
    timer: z.number().default(0),
    mistakes: z.number().max(3).default(0),
    isFinished: z.boolean().default(false),
    isLiked: z.boolean().default(false),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    deletedAt: z.string().datetime().nullable(),
  })
  .strict();

export const CreateGameSchema = GameSchema.omit({
  id: true,
  userId: true,
  uncompletedNonogram: true,
  timer: true,
  mistakes: true,
  isFinished: true,
  isLiked: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
}).strict();

export const UpdateGameSchema = GameSchema.partial()
  .omit({ nonogramId: true })
  .required({ id: true })
  .strict();

export type GameType = z.infer<typeof GameSchema>;
export type CreateGameType = z.infer<typeof CreateGameSchema>;
export type UpdateGameType = z.infer<typeof UpdateGameSchema>;
