import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { NonogramDifficulties, NonogramDifficultiesEnumValues } from '../enums';

export const NonogramSchema = z
  .object({
    id: z.string().uuid(),
    nonogram: z.array(z.array(z.boolean())),
    previewImageBase64: z.string(),
    completeNonogramImageBase64: z.string(),
    pixelHighlightValue: z.number(),
    creatorId: z.string().uuid(),
    isPrivate: z.boolean(),
    difficulty: NonogramDifficultiesEnumValues,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    deletedAt: z.string().datetime().nullable(),
  })
  .strict();

export const CreateNonogramSchema = NonogramSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
}).strict();

export const UpdateNonogramSchema = NonogramSchema.partial();

export class NonogramDto extends createZodDto(NonogramSchema) {}

export class CreateNonogramDto extends createZodDto(CreateNonogramSchema) {}

export class UpdateNonogramDto extends createZodDto(UpdateNonogramSchema) {}
