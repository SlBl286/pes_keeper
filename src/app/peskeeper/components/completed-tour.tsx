"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tournament } from "@/types/tournament";
import {
  Award,
  Calendar,
  Play,
  Plus,
  Trash2,
  Trophy,
  Users,
} from "lucide-react";
import { getStatusBadge } from "./status";
import { getFormatBadge } from "./type";

interface CompletedTournamentsProps {
  completedTournaments: Tournament[];
}
export const CompletedTournaments = ({
  completedTournaments,
}: CompletedTournamentsProps) => {
  return (
    <>
      {completedTournaments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Chưa có giải đấu nào kết thúc
            </h3>
            <p className="text-muted-foreground text-center">
              Các gải đấu đã kết thúc sẽ hiển thị ở đây
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {completedTournaments.map((tournament) => (
            <Card
              key={tournament.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{tournament.name}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      {getStatusBadge(tournament.status)}
                      {getFormatBadge(tournament.type)}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => {}}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {tournament.created_at.toDateString()} -{" "}
                    {tournament.created_at.toDateString()}
                  </span>
                </div>

                {tournament.id && (
                  <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      <span className="font-semibold text-amber-900 dark:text-amber-100">
                        Nhà vô dịch
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                      Người thắng cuộc
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Users className="w-4 h-4" />
                    <span>Người tham gia 0</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {/* {tournament.participants.map((participant) => (
                            <Badge key={participant} variant="outline">
                              {participant}
                            </Badge>
                          ))} */}
                  </div>
                </div>

                <Button className="w-full bg-transparent" variant="outline">
                  Xem kết quả
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};
