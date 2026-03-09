import z from 'zod';
import { NonogramDifficultiesEnumValues } from '../enums';

export const GenerateNonogramSchema = z
  .object({
    imageBase64: z.string(),
    difficulty: NonogramDifficultiesEnumValues,
    mainObjectDimFactor: z.number(),
    previewImageIntRGB: z.number(),
  })
  .strict();

export type GenerateNonogramType = z.infer<typeof GenerateNonogramSchema>;
