"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tournament } from "@/types/tournament";
import { Calendar, Play, Plus, Trash2, Trophy, Users } from "lucide-react";
import { getStatusBadge } from "./status";
import { getFormatBadge } from "./type";
import { useCreateTourDialog } from "@/hooks/use-create-tour-dialog";

interface ActiveTournamentsProps {
  activeTournaments: Tournament[];
}
export const ActiveTournaments = ({
  activeTournaments,
}: ActiveTournamentsProps) => {
  const { setIsOpen: setCreateTourDialogOpen } = useCreateTourDialog();

  return (
    <>
      {activeTournaments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Không có giải đấu nào
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              Tạo giải đấu để bắt đầu
            </p>
            <Button onClick={() => setCreateTourDialogOpen(true)} className="hover:cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Tạo gải đấu
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {activeTournaments.map((tournament) => (
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
                  <span>Bắt đầu: {tournament.created_at.toDateString()}</span>
                </div>

                {tournament.rounds && tournament.rounds && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">
                        Round {tournament.rounds} of {tournament.rounds}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{
                          width: `${
                            (tournament.rounds / tournament.rounds) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Users className="w-4 h-4" />
                    <span>Người tham gia (0)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {/* {tournament.participants
                            .slice(0, 6)
                            .map((participant) => (
                              <Badge key={participant} variant="outline">
                                {participant}
                              </Badge>
                            ))}
                          {tournament.participants.length > 6 && (
                            <Badge variant="outline">
                              +{tournament.participants.length - 6} more
                            </Badge>
                          )} */}
                  </div>
                </div>

                <Button className="w-full" variant="primary">
                  <Play className="w-4 h-4 mr-2" />
                  Quản lý giải đấu
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};
