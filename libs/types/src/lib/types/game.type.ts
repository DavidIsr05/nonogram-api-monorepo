import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { TileStates } from '../enums';

export const GameSchema = z
  .object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    nonogramId: z.string().uuid(),
    uncompletedNonogram: z.array(z.array(z.nativeEnum(TileStates))),
    timer: z.number().default(0),
    hints: z.number().default(3),
    isFinished: z.boolean().default(false),
    rating: z.number().min(0).max(5).default(null),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    deletedAt: z.string().datetime().nullable(),
  })
  .strict();

export const CreateGameSchema = GameSchema.omit({
  id: true,
  uncompletedNonogram: true,
  timer: true,
  hints: true,
  isFinished: true,
  rating: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
}).strict();

export const UpdateGameSchema = GameSchema.partial();

export class GameDto extends createZodDto(GameSchema) {}

export class CreateGameDto extends createZodDto(CreateGameSchema) {}

export class UpdateGameDto extends createZodDto(UpdateGameSchema) {}
