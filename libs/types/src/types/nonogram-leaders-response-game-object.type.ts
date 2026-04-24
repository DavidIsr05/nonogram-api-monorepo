import z from 'zod';

export const NonogramLeadersResponseGameObjectScheme = z
  .object({
    timer: z.number(),
    user: z
      .object({
        username: z.string(),
      })
      .strict(),
  })
  .strip();

export type NonogramLeadersResponseGameObjectType = z.infer<
  typeof NonogramLeadersResponseGameObjectScheme
>;
