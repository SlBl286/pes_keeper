import { email, z } from "zod";
export const TournamentTypeEnum = z.enum(["knockout", "round"]);

// TypeScript type tự động suy ra từ Zod
export type TournamentType = z.infer<typeof TournamentTypeEnum>;
export const TournamentStatusEnum = z.enum(['active', 'upcoming','completed']);

// TypeScript type tự động suy ra từ Zod
export type TournamentStatus = z.infer<typeof TournamentStatusEnum>;

export interface Tournament {
  id: number;
  name: string;
  type: TournamentType;
  status: TournamentStatus;
  created_at: string;
  rounds: number;
}
export interface TournamentPlayer {
  id: number;
  tournament_id: number;
  player_id: number;
}

export const getTournamentSchema = () => {
  return z.object({
    name: z.string("Tên sản phẩm đang để trống").nonempty("Tên sản phẩm đang để trống"), // v
    type: TournamentTypeEnum,
    status: TournamentStatusEnum,
    rounds: z.number().optional(),
    players: z.array(
      z.object({
        name: z.string(),
        avatar: z.string().optional(),
      })
    ),
  });
};

export type TournamentSchemaType = z.infer<
  ReturnType<typeof getTournamentSchema>
>;
