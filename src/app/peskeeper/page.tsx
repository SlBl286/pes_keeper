"use server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trophy,
  Calendar,
  Users,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Edit,
  Trash2,
  Award,
} from "lucide-react";
import Link from "next/link";
import { listTournaments } from "./action";
import { TournamentStatus, TournamentType } from "@/types/tournament";
import { Header } from "./components/header";
import { ActiveTournaments } from "./components/active-tour";
import { UpcomingTournaments } from "./components/upcoming-tour";
import { CompletedTournaments } from "./components/completed-tour";

export default async function TournamentsPage() {
  const tournaments = await listTournaments();

  const upcomingTournaments = tournaments.filter(
    (t) => t.status === "upcoming"
  );
  const activeTournaments = tournaments.filter((t) => t.status === "active");
  const completedTournaments = tournaments.filter(
    (t) => t.status === "completed"
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Đang diễn ra ({activeTournaments.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Sắp diễn ra ({upcomingTournaments.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Hoàn thành ({completedTournaments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <ActiveTournaments activeTournaments={activeTournaments}/>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
           <UpcomingTournaments upcomingTournaments={upcomingTournaments}/>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
           <CompletedTournaments completedTournaments={completedTournaments}/>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
