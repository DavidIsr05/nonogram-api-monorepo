import z from 'zod';

export const CheckAndUpdateInProgressNonogramSchema = z
  .object({
    inProgressNonogramCoordinates: z.array(
      z.object({
        rowIndex: z.number(),
        colIndex: z.number(),
      })
    ),
    timer: z.number(),
    gameId: z.string().uuid(),
  })
  .strict();

export type CheckAndUpdateInProgressNonogramType = z.infer<
  typeof CheckAndUpdateInProgressNonogramSchema
>;
