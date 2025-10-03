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
import { HeadToHead } from "@/types/match";
import { Player } from "@/types/player";
import { TournamentViewModel } from "@/types/tournament";
import { Plus, User } from "lucide-react";
import { JSX, useEffect, useState } from "react";

interface H2HComponentProps {
  tournament: TournamentViewModel | undefined;
  h2h: HeadToHead[];
}

export const H2HComponent = ({ h2h, tournament }: H2HComponentProps) => {
  useEffect(() => {
    console.log(h2h);
  }, []);
  //     const getResultStyling = (
  //     p1 : number,
  //     p2: number,
  //     p1_wins: number,
  //     p2_wins: number
  //   ) => {
  //     if (p1) return "text-muted-foreground";

  //   };

  const buildMatrix = (players: Player[], h2h: HeadToHead[]) => {
    const map: Record<string, HeadToHead> = {};

    h2h.forEach((h) => {
      map[`${h.p1}-${h.p2}`] = h;
      map[`${h.p2}-${h.p1}`] = {
        p1: h.p2,
        p2: h.p1,
        p1_name: h.p1_name,
        p2_name: h.p2_name,
        p1_wins: h.p2_wins,
        p2_wins: h.p1_wins,
        total_matches: h.total_matches,
      };
    });

    return players.map((rowPlayer) => {
      return players.map((colPlayer) => {
        if (rowPlayer.id === colPlayer.id)
          return ["text-muted-foreground", "-"];
        const h = map[`${rowPlayer.id}-${colPlayer.id}`];
        if (!h.total_matches) return ["text-muted-foreground", "vs"];
        return [
          h.p1_wins > h.p2_wins
            ? "text-green-600 dark:text-green-400 font-semibold"
            : h.p1_wins < h.p2_wins
            ? "text-red-600 dark:text-red-400 font-semibold"
            : "text-yellow-600 dark:text-yellow-400 font-semibold",
          `${h.p1_wins}-${h.p2_wins}`,
        ];
      });
    });
  };

  if (!tournament) return <></>;
  const matrix = buildMatrix(tournament.players, h2h);
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 uppercase">
            <User className="w-5 h-5 text-primary " />
            Bảng kết quả đối đầu
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 text-left font-semibold min-w-[120px]"></th>
                  {tournament.players.map((player) => (
                    <th
                      key={player.id}
                      className="p-3 text-center font-semibold min-w-[100px] text-sm"
                    >
                      {player.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tournament.players.map((rowPlayer, rowIndex) => (
                  <tr
                    key={rowPlayer.id}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-3 font-semibold bg-muted/20 border-r">
                      {rowPlayer.name}
                    </td>
                    {matrix[rowIndex].map((cell, colIndex) => (
                      <td key={colIndex} className="p-3 text-center">
                        <span className={cell[0]}>{cell[1]}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Legend for matrix results */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Thắng</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Thua</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Hoà</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">vs</span>
              <span>Chưa đá trận nào</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
