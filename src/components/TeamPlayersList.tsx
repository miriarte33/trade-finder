import type { Player } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TeamPlayersListProps {
  players: Player[];
}

export function TeamPlayersList({ players }: TeamPlayersListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Players (Sorted by Value)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-right">Overall Rank</TableHead>
              <TableHead className="text-right">Position Rank</TableHead>
              <TableHead className="text-center">Starter</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.player.id}>
                <TableCell className="font-medium">
                  {player.player.name}
                </TableCell>
                <TableCell>{player.player.position}</TableCell>
                <TableCell className="text-right">{player.value}</TableCell>
                <TableCell className="text-right">
                  #{player.overallRank}
                </TableCell>
                <TableCell className="text-right">
                  {player.player.position} #{player.positionRank}
                </TableCell>
                <TableCell className="text-center">
                  {player.starter ? "✓" : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
