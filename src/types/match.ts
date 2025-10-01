export interface Match {
  id: number;
  tournament_id: number;
  round: number;
  player1_id: number;
  player2_id: number;
  team1_name: string;
  team2_name: string;
  score1: number;
  score2: number;
  winner_id?: number;
  played_at?: string;
}
