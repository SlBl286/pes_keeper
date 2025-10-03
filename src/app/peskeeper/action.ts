"use server";

import db from "@/lib/db";
import { HeadToHead, Match } from "@/types/match";
import { Player } from "@/types/player";
import { Standing, Tournament, TournamentSchemaType, TournamentViewModel } from "@/types/tournament";

export async function listTournaments(): Promise<TournamentViewModel[]> {
const tournaments = db.prepare(`
    SELECT *
    FROM tournaments
    ORDER BY created_at DESC
  `).all() as Omit<TournamentViewModel, "players" | "round_played">[];

  // 2. Chuẩn bị query players và round_played
  const playerStmt = db.prepare(`
    SELECT p.*
    FROM players p
    join tournament_players tp on tp.player_id = p.id 
    WHERE tp.tournament_id = ?
  `);

  const roundStmt = db.prepare(`
    SELECT COUNT(DISTINCT round) as round_played
    FROM matches
    WHERE tournament_id = ? AND winner_id is not null
  `);

  // 3. Map tournaments -> bổ sung players + round_played
  return tournaments.map((t) => {
    const players = playerStmt.all(t.id) as Player[];
    const { round_played } = roundStmt.get(t.id) as { round_played: number };

    return {
      ...t,
      players,
      round_played,
    };
  });
}
export async function getTournament({id}: {id:number}): Promise<TournamentViewModel | undefined> {
const tournament = db.prepare(`
    SELECT *
    FROM tournaments
    WHERE id = ?
  `).get(id) as Omit<TournamentViewModel, "players" | "round_played"> | undefined;
  if (!tournament) return undefined;
  // 2. Chuẩn bị query players và round_played
  const players = db.prepare(`
    SELECT p.*
    FROM players p
    join tournament_players tp on tp.player_id = p.id 
    WHERE tp.tournament_id = ?
  `).all(id) as TournamentViewModel["players"];
  const roundStmt = db.prepare(`
    SELECT COUNT(DISTINCT round) as round_played
    FROM matches
    WHERE tournament_id = ? AND winner_id is not null
  `);

  // 3. Map tournaments -> bổ sung players + round_played
   return {
    ...tournament,
    players,
    round_played : 0,

  };
}

export async function createTournament(data: TournamentSchemaType) {
  const stmtTours = db
    .prepare(
      "INSERT INTO tournaments (name, type,status, rounds) VALUES (?, ?, ?, ?)"
    )
    .run(data.name, data.type, data.status, data.rounds);

  // players
  const playerPlaceholders = data.players.map(() => "(?, ?)").join(", ");
  const stmtPlayers = db.prepare(`
  INSERT INTO players (name,avatar)
  VALUES ${playerPlaceholders}
  RETURNING id
`);
  const playerValues = data.players.flatMap((u) => [u.name, u.avatar]);
    console.log(`
  INSERT INTO players (name,avatar)
  VALUES ${playerPlaceholders}
  RETURNING id
`)

  const playerIds = stmtPlayers.all(...playerValues) as {id: number}[];
  console.log(playerIds)

  // tour_player
  const tourPlayerPlaceholders = data.players.map(() => "(?, ?)").join(", ");
  const stmtTourPlayers = db.prepare(`
  INSERT INTO tournament_players (tournament_id,player_id)
  VALUES ${tourPlayerPlaceholders}
  RETURNING id
`);
  const tourPlayerValues = playerIds.flatMap((u: any) => [stmtTours.lastInsertRowid, u.id]);
  stmtTourPlayers.all(...tourPlayerValues);
}

export async function getAllHeadToHeadByTournament(tournament_id: number): Promise<HeadToHead[]> {
  const stmt = db.prepare(`
     WITH player_pairs AS (
      SELECT 
        p1.id AS p1,
        p2.id AS p2,
        p1.name AS p1_name,
        p2.name AS p2_name
      FROM players p1
      JOIN players p2 
        ON p1.id < p2.id
      join tournament_players tp1 on tp1.player_id = p1.id
      join tournament_players tp2 on tp2.player_id = p2.id
      WHERE tp1.tournament_id = ?
        AND tp2.tournament_id = ?
    ),
    matches_summary AS (
      -- normalize pair order here and compute wins for normalized p1/p2
      SELECT
        CASE WHEN player1_id < player2_id THEN player1_id ELSE player2_id END AS p1,
        CASE WHEN player1_id < player2_id THEN player2_id ELSE player1_id END AS p2,
        SUM(
          CASE 
            WHEN winner_id = (CASE WHEN player1_id < player2_id THEN player1_id ELSE player2_id END)
            THEN 1 ELSE 0 END
        ) AS p1_wins,
        SUM(
          CASE 
            WHEN winner_id = (CASE WHEN player1_id < player2_id THEN player2_id ELSE player1_id END)
            THEN 1 ELSE 0 END
        ) AS p2_wins,
        COUNT(*) AS total_matches
      FROM matches
      WHERE tournament_id = ?
      GROUP BY p1, p2
    )
    SELECT
      pp.p1,
      pp.p2,
      pp.p1_name,
      pp.p2_name,
      COALESCE(ms.p1_wins, 0)   AS p1_wins,
      COALESCE(ms.p2_wins, 0)   AS p2_wins,
      COALESCE(ms.total_matches, 0) AS total_matches
    FROM player_pairs pp
    LEFT JOIN matches_summary ms
      ON ms.p1 = pp.p1 AND ms.p2 = pp.p2
    ORDER BY pp.p1, pp.p2
  `);
  let h2h = stmt.all(tournament_id,tournament_id,tournament_id) as HeadToHead[];
  console.log(h2h)
  return h2h
}

export async function getStandings(tournament_id: number): Promise<Standing[]> {
  const stmt = db.prepare(`
     WITH match_stats AS (
      SELECT
        p.id AS player_id,
        p.name AS player_name,
        COUNT(m.id) AS games_played,
        SUM(CASE WHEN m.winner_id = p.id THEN 1 ELSE 0 END) AS wins,
        SUM(CASE WHEN m.winner_id IS NOT NULL AND m.winner_id != p.id THEN 1 ELSE 0 END) AS losses,
        SUM(CASE WHEN m.id IS NOT NULL AND m.winner_id IS NULL THEN 1 ELSE 0 END) AS draws,
        SUM(CASE WHEN p.id = m.player1_id THEN m.score1
                 WHEN p.id = m.player2_id THEN m.score2 ELSE 0 END) AS goal_for,
        SUM(CASE WHEN p.id = m.player1_id THEN m.score2
                 WHEN p.id = m.player2_id THEN m.score1 ELSE 0 END) AS goal_against
      FROM players p
      LEFT JOIN matches m 
        ON (p.id = m.player1_id OR p.id = m.player2_id)
      left Join tournament_players tp on tp.player_id = p.id
      WHERE tp.tournament_id = ?
      GROUP BY p.id, p.name
    )
    SELECT
      player_id,
      player_name,
      games_played,
      wins,
      losses,
      draws,
      wins * 3 + draws AS points,
      goal_for,
      goal_against,
      (goal_for - goal_against) AS goal_diff
    FROM match_stats
    ORDER BY points DESC, goal_diff DESC, goal_for DESC, player_name ASC
  `);

  return stmt.all(tournament_id) as Standing[];
}

export async function getMatchess(tournament_id: number): Promise<Match[]> {
  const stmt = db.prepare(`
    SELECT m.*,
    p1.name as player1_name,
    p2.name as player2_name
    FROM matches m
    left join players p1 on m.player1_id = p1.id
    left join players p2 on m.player2_id = p2.id
    WHERE m.tournament_id = ?
    ORDER BY m.played_at DESC
  `);

  return stmt.all(tournament_id) as Match[];
}