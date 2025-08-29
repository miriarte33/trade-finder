import type { Player } from "@/lib/types";
import type { SortField, SortOrder } from "@/contexts/LeagueDetailsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SortableTableHead } from "@/components/SortableTableHead";

interface TeamPlayersListProps {
  players: Player[];
  sortBy: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
}

export function TeamPlayersList({ players, sortBy, sortOrder, onSort }: TeamPlayersListProps) {
  const getSortLabel = () => {
    switch (sortBy) {
      case 'value':
        return 'Value';
      case 'overallRank':
        return 'Overall Rank';
      case 'starter':
        return 'Starter Status';
      case 'position':
        return 'Position';
      default:
        return 'Value';
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Players (Sorted by {getSortLabel()})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player Name</TableHead>
              <SortableTableHead
                field="position"
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
              >
                Position
              </SortableTableHead>
              <SortableTableHead
                field="value"
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                className="text-right"
              >
                Value
              </SortableTableHead>
              <SortableTableHead
                field="overallRank"
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                className="text-right"
              >
                Overall Rank
              </SortableTableHead>
              <TableHead className="text-right">Position Rank</TableHead>
              <SortableTableHead
                field="starter"
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                onSort={onSort}
                className="text-center"
              >
                Starter
              </SortableTableHead>
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
