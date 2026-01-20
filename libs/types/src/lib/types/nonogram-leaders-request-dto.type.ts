import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const nonogramLeadersRequestSchema = z
  .object({
    id: z.string().uuid(),
  })
  .strict();

export class nonogramLeadersRequestDto extends createZodDto(
  nonogramLeadersRequestSchema
) {}
