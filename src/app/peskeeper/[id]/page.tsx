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
  Target,
  Clock,
  History,
  User,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { getAllHeadToHeadByTournament, getMatchess, getStandings, getTournament, listTournaments } from "../action";
import { H2HComponent } from "./components/h2h";
import { StandingComponent } from "./components/standing";
import { HistoryComponent } from "./components/history";
interface DetailTournamentPageProps {
  params: { id: number }
}
export default async function DetailTournament({
  params,
}: DetailTournamentPageProps) {
  const tournament = await getTournament({id:params.id})
  const h2h = await getAllHeadToHeadByTournament( params.id);
  const standings = await getStandings(params.id);
  const matches = await getMatchess(params.id);





  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Link href="/peskeeper">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl">
              <Trophy className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-balance uppercase">{tournament?.name}</h1>
              <p className="text-muted-foreground">Theo dõi kết quả giải đấu</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="standings" className="w-full">
          <TabsList className="grid w-full grid-cols-1  md:grid-cols-3 mb-8">
            <TabsTrigger value="matches" className="flex items-center gap-2 w-full">
              <Target className="w-4 h-4" />
              H2H
            </TabsTrigger>
            <TabsTrigger value="standings" className="flex items-center gap-2  w-full">
              <Trophy className="w-4 h-4" />
              BXH
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2  w-full">
              <History className="w-4 h-4" />
              Lịch sử
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="space-y-6">
              <H2HComponent h2h={h2h} tournament={tournament}/>
          </TabsContent>

          <TabsContent value="standings" className="space-y-6">
          <StandingComponent tournament={tournament} standings={standings}/>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <HistoryComponent tournament={tournament} matches={matches}/>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
