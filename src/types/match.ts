export interface Match {
  id: number;
  tournament_id: number;
  round: number;
  player1_id: number;
  player2_id: number;
   player1_name: string;
  player2_name: string;
  team1_name: string;
  team2_name: string;
  score1: number;
  score2: number;
  winner_id?: number;
  played_at?: string;
}

export type HeadToHead = {
  p1: number;
  p2: number;
  p1_name: string;
  p2_name: string;
  p1_wins: number;
  p2_wins: number;
  total_matches: number;
};
