"use server";

import db from "@/lib/db";
import { Player } from "@/types/player";
import { Tournament, TournamentSchemaType } from "@/types/tournament";

export async function listTournaments(): Promise<Tournament[]> {
  let result = db
    .prepare<Tournament[]>("SELECT * FROM tournaments ORDER BY created_at DESC")
    .all() as Tournament[];
  console.log(result);
  return result;
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

  console.log(...playerValues)
  const playerIds = stmtPlayers.all(...playerValues);
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
