import z from 'zod';
import { NonogramDifficultiesEnumValues } from '../enums';
import { createZodDto } from 'nestjs-zod';

export const GenerateNonogramSchema = z
  .object({
    imageBase64: z.string(),
    difficulty: NonogramDifficultiesEnumValues,
    mainObjectDimFactor: z.number(),
    previewImageIntRGB: z.number(),
  })
  .strict();

export class GenerateNonogramDto extends createZodDto(GenerateNonogramSchema) {}
