"use client";

import { Badge } from "@/components/ui/badge";
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
import { formatDate, formatTime } from "@/lib/utils";
import { Match } from "@/types/match";
import { TournamentViewModel } from "@/types/tournament";
import { Calendar, Clock, Plus, User } from "lucide-react";
import { useState } from "react";
interface HistoryComponentProps {
  tournament: TournamentViewModel | undefined;
  matches: Match[];
}

export const HistoryComponent = ({
  matches,
  tournament,
}: HistoryComponentProps) => {
  const getStatusBadge = (status: string) => {
    if (status === "completed") {
      return (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        >
          Completed
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-primary text-primary">
        Upcoming
      </Badge>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Lịch sử đấu</h2>
      </div>

      <div className="grid gap-4">
        {matches.map((match) => (
          <Card key={match.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="flex flex-col w-full items-center justify-center ">
                <div className="flex items-center justify-between gap-6 mb-4">
                  {/* Player 1 */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex flex-col items-end flex-1">
                      <span className="font-bold text-2xl text-primary">
                        {match.player1_name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({match.team1_name})
                      </span>
                    </div>
                    {match.score1 && (
                      <span className="text-2xl font-bold text-primary min-w-[40px] text-center">
                        {match.score1}
                      </span>
                    )}
                  </div>

                  {/* VS Divider */}
                  <div className="flex items-center justify-center min-w-[60px]">
                    <span className="text-lg font-semibold text-muted-foreground">
                      VS
                    </span>
                  </div>

                  {/* Player 2 */}
                  <div className="flex items-center gap-3 flex-1">
                    {match.score2 && (
                      <span className="text-2xl font-bold text-primary min-w-[40px] text-center">
                        {match.score2}
                      </span>
                    )}
                    <div className="flex flex-col items-start flex-1">
                      <span className="font-bold text-lg text-primary">
                        {match.player2_name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({match.team2_name})
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 min-w-[200px] justify-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatDate(match.played_at ?? new Date())}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatTime(match.played_at ?? new Date())}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};
