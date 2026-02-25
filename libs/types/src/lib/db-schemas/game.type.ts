import { z } from 'zod';
import { TileStates } from '../enums';

export const GameSchema = z
  .object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    nonogramId: z.string().uuid(),
    uncompletedNonogram: z.array(z.array(z.nativeEnum(TileStates))).nullable(),
    timer: z.number().default(0),
    hints: z.number().max(3).default(3),
    mistakes: z.number().max(3).default(0),
    isFinished: z.boolean().default(false),
    rating: z.number().min(0).max(5).nullable(),
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
  hints: true,
  mistakes: true,
  isFinished: true,
  rating: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
}).strict();

export const UpdateGameSchema = GameSchema.partial()
  .omit({ nonogramId: true })
  .required({ id: true })
  .strict();

export type GameDto = z.infer<typeof GameSchema>;
export type CreateGameDto = z.infer<typeof CreateGameSchema>;
export type UpdateGameDto = z.infer<typeof UpdateGameSchema>;
