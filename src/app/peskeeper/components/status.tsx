import { Badge } from "@/components/ui/badge";
import { TournamentStatus } from "@/types/tournament";
import { CheckCircle2, Clock, Play } from "lucide-react";

export const getStatusBadge = (status: TournamentStatus) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge
            variant="outline"
            className="border-blue-500 text-blue-700 dark:text-blue-400"
          >
            <Clock className="w-3 h-3 mr-1" />
            Sắp diễn ra
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-amber-500 text-white hover:bg-amber-600">
            <Play className="w-3 h-3 mr-1" />
            Đang diễn ra
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-600 text-white hover:bg-green-700">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Hoàn thành
          </Badge>
        );
    }
  };

