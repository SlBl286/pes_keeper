import { Badge } from "@/components/ui/badge";
import { TournamentType } from "@/types/tournament";

 export const getFormatBadge = (type: TournamentType) => {
    return (
      <Badge
        variant="secondary"
        className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200"
      >
        {type === "knockout" ? "Loại trực tiếp" : "Theo vòng"}
      </Badge>
    );
  };