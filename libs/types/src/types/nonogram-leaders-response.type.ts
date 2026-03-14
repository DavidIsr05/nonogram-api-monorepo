import z from 'zod';

export const NonogramLeadersResponseSchema = z.object({
  id: z.string().uuid(),
  games: z.array(
    z.object({
      timer: z.number(),
      user: z.object({
        username: z.string(),
      }),
    })
  ),
});

export type NonogramLeadersResponseType = z.infer<
  typeof NonogramLeadersResponseSchema
>;
