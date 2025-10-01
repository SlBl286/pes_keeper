"use server";

import db from "@/lib/db";
import { Tournament } from "@/types/tournament";

export async function listTournaments(): Promise<Tournament[]> {
  return db.prepare<Tournament[]>("SELECT * FROM tournaments ORDER BY created_at DESC").all() as Tournament[];
}

export async function createTournament(formData: FormData) {
  const name = String(formData.get("name"));
  const type = String(formData.get("type"));
  const rounds = Number(formData.get("rounds") || 1);

  db.prepare("INSERT INTO tournaments (name, type, rounds) VALUES (?, ?, ?)")
    .run(name, type, rounds);
}