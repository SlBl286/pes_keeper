"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Standing, TournamentViewModel } from "@/types/tournament";
import { Plus, Trophy, User } from "lucide-react";
import { useState } from "react";
interface StandingComponentProps {
  tournament: TournamentViewModel | undefined;
  standings: Standing[];
}

export const StandingComponent = ({
  tournament,
  standings,
}: StandingComponentProps) => {
  const getPositionColor = (position: number) => {
    if (position <= 2) return "text-green-600 dark:text-green-400";
    if (position <= 3) return "text-blue-600 dark:text-blue-400";
    if (position >= 4) return "text-red-600 dark:text-red-400";
    return "text-foreground";
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Bảng xếp hạng người chơi</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            BXH {tournament?.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr className="text-left">
                  <th className="p-4 font-semibold">Hạng</th>
                  <th className="p-4 font-semibold">Người chơi</th>
                  <th className="p-4 font-semibold text-center">P</th>
                  <th className="p-4 font-semibold text-center">W</th>
                  <th className="p-4 font-semibold text-center">D</th>
                  <th className="p-4 font-semibold text-center">L</th>
                  <th className="p-4 font-semibold text-center">GF</th>
                  <th className="p-4 font-semibold text-center">GA</th>
                  <th className="p-4 font-semibold text-center">GD</th>
                  <th className="p-4 font-semibold text-center">Pts</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((player, index) => (
                  <tr
                    key={player.player_id}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <span
                        className={`font-bold ${getPositionColor(index + 1)}`}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold">
                        {player.player_name}
                      </span>
                    </td>
                    <td className="p-4 text-center">{player.games_played}</td>
                    <td className="p-4 text-center text-green-600 dark:text-green-400">
                      {player.wins}
                    </td>
                    <td className="p-4 text-center text-yellow-600 dark:text-yellow-400">
                      {player.draws}
                    </td>
                    <td className="p-4 text-center text-red-600 dark:text-red-400">
                      {player.losses}
                    </td>
                    <td className="p-4 text-center">{player.goal_for}</td>
                    <td className="p-4 text-center">{player.goal_against}</td>
                    <td className="p-4 text-center">
                      <span
                        className={
                          player.goal_diff >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      >
                        {player.goal_diff >= 0 ? "+" : ""}
                        {player.goal_diff}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-bold text-primary text-lg">
                        {player.points}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Dẫn đầu (1-2)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Cũng cũng (3)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Cuối bảng (4+)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
