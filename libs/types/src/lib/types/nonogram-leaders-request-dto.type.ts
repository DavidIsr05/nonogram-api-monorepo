import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const NonogramLeadersRequestSchema = z
  .object({
    id: z.string().uuid(),
  })
  .strict();

export class NonogramLeadersRequestDto extends createZodDto(
  NonogramLeadersRequestSchema
) {}
