"use client";

import { useState } from "react";
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

export default async function DetailTournament({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const [activeTab, setActiveTab] = useState("matches");
  const [players, setPlayers] = useState<{ id: number; name: string }[]>([]);
  const [matches, setMatches] = useState(initialMatches);
  const [isManagePlayersOpen, setIsManagePlayersOpen] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [editPlayerName, setEditPlayerName] = useState("");
  const [isAddMatchOpen, setIsAddMatchOpen] = useState(false);
  const [newMatch, setNewMatch] = useState({
    player1: "",
    player1Team: "",
    player2: "",
    player2Team: "",
    player1Score: "",
    player2Score: "",
    date: "",
    time: "",
    status: "completed" as "completed" | "upcoming",
  });

  const addPlayer = () => {
    setPlayers([...players]);
  };

  const startEditPlayer = (player: string) => {
    setEditingPlayer(player);
    setEditPlayerName(player);
  };

  const saveEditPlayer = () => {
    if (editPlayerName.trim() && !players.includes(editPlayerName.trim())) {
      setPlayers(
        players.map((p) => (p === editingPlayer ? editPlayerName.trim() : p))
      );
      setEditingPlayer(null);
      setEditPlayerName("");
    }
  };

  const deletePlayer = (playerToDelete: string) => {
    setPlayers(players.filter((p) => p !== playerToDelete));
  };

  const cancelEdit = () => {
    setEditingPlayer(null);
    setEditPlayerName("");
  };

  const addMatch = () => {
    if (
      newMatch.player1 &&
      newMatch.player2 &&
      newMatch.player1 !== newMatch.player2 &&
      newMatch.player1Team &&
      newMatch.player2Team &&
      newMatch.date &&
      newMatch.time
    ) {
      const matchToAdd = {
        id: Math.max(...matches.map((m) => m.id), 0) + 1,
        player1: newMatch.player1,
        player1Team: newMatch.player1Team,
        player2: newMatch.player2,
        player2Team: newMatch.player2Team,
        player1Score:
          newMatch.status === "completed"
            ? Number.parseInt(newMatch.player1Score) || 0
            : null,
        player2Score:
          newMatch.status === "completed"
            ? Number.parseInt(newMatch.player2Score) || 0
            : null,
        date: newMatch.date,
        time: newMatch.time,
        status: newMatch.status,
      };

      //   setMatches([matchToAdd, ...matches])
      setNewMatch({
        player1: "",
        player1Team: "",
        player2: "",
        player2Team: "",
        player1Score: "",
        player2Score: "",
        date: "",
        time: "",
        status: "completed",
      });
      setIsAddMatchOpen(false);
    }
  };

  const resetMatchForm = () => {
    setNewMatch({
      player1: "",
      player1Team: "",
      player2: "",
      player2Team: "",
      player1Score: "",
      player2Score: "",
      date: "",
      time: "",
      status: "completed",
    });
  };

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

  const getPositionColor = (position: number) => {
    if (position <= 2) return "text-green-600 dark:text-green-400";
    if (position <= 3) return "text-blue-600 dark:text-blue-400";
    if (position >= 4) return "text-red-600 dark:text-red-400";
    return "text-foreground";
  };

  const getResultStyling = (
    result: string,
    player1: string,
    player2: string
  ) => {
    if (!result) return "text-muted-foreground";

    const [player1Score, player2Score] = result.split("-").map(Number);
    if (player1Score > player2Score)
      return "text-green-600 dark:text-green-400 font-semibold";
    if (player1Score < player2Score)
      return "text-red-600 dark:text-red-400 font-semibold";
    return "text-yellow-600 dark:text-yellow-400 font-semibold";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Link href="/">
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
              <h1 className="text-3xl font-bold text-balance">PES CNTT OPEN</h1>
              <p className="text-muted-foreground">Theo dõi kết quả giải đấu</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="matches" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              H2H
            </TabsTrigger>
            <TabsTrigger value="standings" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              BXH
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Lịch sử
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Kết quả đối đầu</h2>
              <Dialog open={isAddMatchOpen} onOpenChange={setIsAddMatchOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Match
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5 text-primary" />
                      Add New Match
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Player 1 Selection */}
                    <div className="space-y-2">
                      <Label>Player 1</Label>
                      <Select
                        value={newMatch.player1}
                        onValueChange={(value) =>
                          setNewMatch({ ...newMatch, player1: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Player 1" />
                        </SelectTrigger>
                        <SelectContent>
                          {players
                            .filter((p) => p !== newMatch.player2)
                            .map((player) => (
                              <SelectItem key={player} value={player}>
                                {player}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Player 1 Team Selection */}
                    <div className="space-y-2">
                      <Label>Player 1 Team</Label>
                      <Select
                        value={newMatch.player1Team}
                        onValueChange={(value) =>
                          setNewMatch({ ...newMatch, player1Team: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Team" />
                        </SelectTrigger>
                        <SelectContent>
                          {footballTeams.map((team) => (
                            <SelectItem key={team} value={team}>
                              {team}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Player 2 Selection */}
                    <div className="space-y-2">
                      <Label>Player 2</Label>
                      <Select
                        value={newMatch.player2}
                        onValueChange={(value) =>
                          setNewMatch({ ...newMatch, player2: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Player 2" />
                        </SelectTrigger>
                        <SelectContent>
                          {players
                            .filter((p) => p !== newMatch.player1)
                            .map((player) => (
                              <SelectItem key={player} value={player}>
                                {player}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Player 2 Team Selection */}
                    <div className="space-y-2">
                      <Label>Player 2 Team</Label>
                      <Select
                        value={newMatch.player2Team}
                        onValueChange={(value) =>
                          setNewMatch({ ...newMatch, player2Team: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Team" />
                        </SelectTrigger>
                        <SelectContent>
                          {footballTeams.map((team) => (
                            <SelectItem key={team} value={team}>
                              {team}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Match Status */}
                    <div className="space-y-2">
                      <Label>Match Status</Label>
                      <Select
                        value={newMatch.status}
                        onValueChange={(value: "completed" | "upcoming") =>
                          setNewMatch({ ...newMatch, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Scores (only if completed) */}
                    {newMatch.status === "completed" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Player 1 Score</Label>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={newMatch.player1Score}
                            onChange={(e) =>
                              setNewMatch({
                                ...newMatch,
                                player1Score: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Player 2 Score</Label>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={newMatch.player2Score}
                            onChange={(e) =>
                              setNewMatch({
                                ...newMatch,
                                player2Score: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={newMatch.date}
                          onChange={(e) =>
                            setNewMatch({ ...newMatch, date: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Input
                          type="time"
                          value={newMatch.time}
                          onChange={(e) =>
                            setNewMatch({ ...newMatch, time: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4">
                      <Button onClick={addMatch} className="flex-1">
                        Add Match
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          resetMatchForm();
                          setIsAddMatchOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Bảng kết quả đối đầu
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="p-3 text-left font-semibold min-w-[120px]"></th>
                        {players.map((player) => (
                          <th
                            key={player}
                            className="p-3 text-center font-semibold min-w-[100px] text-sm"
                          >
                            {player}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {players.map((player1) => (
                        <tr
                          key={player1}
                          className="border-b hover:bg-muted/30 transition-colors"
                        >
                          <td className="p-3 font-semibold bg-muted/20 border-r">
                            {player1}
                          </td>
                          {players.map((player2) => (
                            <td key={player2} className="p-3 text-center">
                              {player1 === player2 ? (
                                <span className="text-muted-foreground">-</span>
                              ) : (
                                <span
                                //   className={getResultStyling(
                                //     playerResults[player1]?.[player2],
                                //     player1,
                                //     player2
                                //   )}
                                >
                                  {/* {playerResults[player1]?.[player2] || "vs"} */}
                                  vs
                                </span>
                              )}
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
                    <span>Hàng thắng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Cột thắng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span>Hoà</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">vs</span>
                    <span>Chưa có trận nào</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="standings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Bảng xếp hạng người chơi</h2>
              <Dialog
                open={isManagePlayersOpen}
                onOpenChange={setIsManagePlayersOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Users className="w-4 h-4" />
                    Manage Players
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Manage Players
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Add new player */}
                    <div className="space-y-2">
                      <Label htmlFor="newPlayer">Add New Player</Label>
                      <div className="flex gap-2">
                        <Input
                          id="newPlayer"
                          placeholder="Enter player name"
                          value={newPlayerName}
                          onChange={(e) => setNewPlayerName(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addPlayer()}
                        />
                        <Button
                          onClick={addPlayer}
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </Button>
                      </div>
                    </div>

                    {/* Player list */}
                    <div className="space-y-2">
                      <Label>Current Players</Label>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {players.map((player) => (
                          <div
                            key={player}
                            className="flex items-center justify-between p-2 border rounded-lg"
                          >
                            {editingPlayer === player ? (
                              <div className="flex items-center gap-2 flex-1">
                                <Input
                                  value={editPlayerName}
                                  onChange={(e) =>
                                    setEditPlayerName(e.target.value)
                                  }
                                  onKeyPress={(e) =>
                                    e.key === "Enter" && saveEditPlayer()
                                  }
                                  className="flex-1"
                                />
                                <Button
                                  onClick={saveEditPlayer}
                                  size="sm"
                                  variant="outline"
                                >
                                  Save
                                </Button>
                                <Button
                                  onClick={cancelEdit}
                                  size="sm"
                                  variant="ghost"
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <>
                                <span className="font-medium">{player}</span>
                                <div className="flex items-center gap-1">
                                  <Button
                                    onClick={() => startEditPlayer(player)}
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    onClick={() => deletePlayer(player)}
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  BXH PES CNTT OPEN
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
                        <th className="p-4 font-semibold text-center">Win%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {playerStandings.map((player) => (
                        <tr
                          key={player.position}
                          className="border-b hover:bg-muted/30 transition-colors"
                        >
                          <td className="p-4">
                            <span
                              className={`font-bold ${getPositionColor(
                                player.position
                              )}`}
                            >
                              {player.position}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold">
                              {player.player}
                            </span>
                          </td>
                          <td className="p-4 text-center">{player.played}</td>
                          <td className="p-4 text-center text-green-600 dark:text-green-400">
                            {player.won}
                          </td>
                          <td className="p-4 text-center text-yellow-600 dark:text-yellow-400">
                            {player.drawn}
                          </td>
                          <td className="p-4 text-center text-red-600 dark:text-red-400">
                            {player.lost}
                          </td>
                          <td className="p-4 text-center">{player.goalsFor}</td>
                          <td className="p-4 text-center">
                            {player.goalsAgainst}
                          </td>
                          <td className="p-4 text-center">
                            <span
                              className={
                                player.goalDifference >= 0
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }
                            >
                              {player.goalDifference >= 0 ? "+" : ""}
                              {player.goalDifference}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="font-bold text-primary">
                              {player.points}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="font-semibold">
                              {player.winRate}%
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
                    <span>Top Players (1-2)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Mid Tier (3)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Bottom Tier (4+)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Match History</h2>
            </div>

            <div className="grid gap-4">
              {matches.map((match) => (
                <Card
                  key={match.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {match.date}
                        </span>
                        <Clock className="w-4 h-4 text-muted-foreground ml-4" />
                        <span className="text-sm text-muted-foreground">
                          {match.time}
                        </span>
                      </div>
                      {getStatusBadge(match.status)}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex flex-col">
                            <span className="font-bold text-lg text-primary">
                              {match.player1}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ({match.player1Team})
                            </span>
                          </div>
                          {match.status === "completed" && (
                            <span className="text-2xl font-bold text-primary">
                              {match.player1Score}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="font-bold text-lg text-primary">
                              {match.player2}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ({match.player2Team})
                            </span>
                          </div>
                          {match.status === "completed" && (
                            <span className="text-2xl font-bold text-primary">
                              {match.player2Score}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-6 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>PES Match</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
