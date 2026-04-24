import z from 'zod';

export const UserStatsSchema = z
  .object({
    nonogramsCreated: z.number(),
    gamesPlayed: z.number(),
    averageTimer: z.number(),
    nonogramsLiked: z.number(),
    nonogramsComplete: z.number(),
  })
  .strip();

export type UserStatsType = z.infer<typeof UserStatsSchema>;
