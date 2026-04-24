import { createZodDto } from 'nestjs-zod';
import {
  GameSchema,
  CreateGameSchema,
  UpdateGameSchema,
  CheckAndUpdateInProgressNonogramSchema,
} from '@nonogram-api-monorepo/types';

export class GameDto extends createZodDto(GameSchema) {}
export class CreateGameDto extends createZodDto(CreateGameSchema) {}
export class UpdateGameDto extends createZodDto(UpdateGameSchema) {}
export class CheckAndUpdateInProgressNonogramDto extends createZodDto(
  CheckAndUpdateInProgressNonogramSchema
) {}
