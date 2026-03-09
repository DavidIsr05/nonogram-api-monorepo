import z from 'zod';

const ExceptionSchema = z.object({
  status: z.number().or(z.string()),
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

export type ExceptionType = z.infer<typeof ExceptionSchema>;
