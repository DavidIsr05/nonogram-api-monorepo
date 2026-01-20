import z from 'zod';
import { NonogramDifficultiesEnumValues } from '../enums';
import { createZodDto } from 'nestjs-zod';

export const generateNonogramSchema = z
  .object({
    imageBase64: z.string(),
    difficulty: NonogramDifficultiesEnumValues,
    mainObjectDimFactor: z.number(),
    previewImageIntRGB: z.number(),
  })
  .strict();

export class generateNonogramDto extends createZodDto(generateNonogramSchema) {}
