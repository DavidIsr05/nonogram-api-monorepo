import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const ExceptionSchema = z.object({
  status: z.number(),
  data: z.object({
    statusCode: z.number(),
    message: z.object({
      statusCode: z.number(),
      message: z.string(),
      errors: z.array(
        z.object({
          code: z.string(),
          message: z.string(),
          path: z.array(z.string()),
        })
      ),
    }),
    timestamp: z.string(),
    path: z.string(),
  }),
});
export class ExceptionType extends createZodDto(ExceptionSchema) {}
