"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tournament } from "@/types/tournament";
import { Calendar, Clock, Edit, Plus, Trash2, Users } from "lucide-react";
import { getStatusBadge } from "./status";
import { getFormatBadge } from "./type";
import { useCreateTourDialog } from "@/hooks/use-create-tour-dialog";

interface UpcomingTournamentsProps {
  upcomingTournaments: Tournament[];
}
export const UpcomingTournaments = ({
  upcomingTournaments,
}: UpcomingTournamentsProps) => {
    const { setIsOpen: setCreateTourDialogOpen } = useCreateTourDialog();
  
  return (
    <>
      {upcomingTournaments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Không có giải đấu sắp diễn ra
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              Danh sách giải đấu sắp diễn ra
            </p>
             <Button onClick={() => setCreateTourDialogOpen(true)} className="hover:cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Tạo gải đấu
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {upcomingTournaments.map((tournament) => (
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
                  <span>Starts: {tournament.created_at.toDateString()}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Users className="w-4 h-4" />
                    <span>Nguòi tham gia 0</span>
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
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa giải đấu
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};
