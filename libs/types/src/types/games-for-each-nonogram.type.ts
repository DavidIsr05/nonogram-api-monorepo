import z from 'zod';

export const gamesForEachNonogramSchema = z.object({
  id: z.string().uuid(),
  games: z.array(
    z.object({
      timer: z.number(),
      mistakes: z.number(),
      hints: z.number(),
      user: z.object({
        username: z.string(),
      }),
    })
  ),
});

export type GamesForEachNonogramType = z.infer<
  typeof gamesForEachNonogramSchema
>;
