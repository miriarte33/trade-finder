import type { Player } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface TradeOfferCardProps {
  players: Player[];
  teamName: string;
  teamOwner: string;
  totalValue: number;
}

export function TradeOfferCard({
  players,
  teamName,
  teamOwner,
  totalValue,
}: TradeOfferCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">{teamName}</p>
            <p className="text-xs text-muted-foreground">({teamOwner})</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Value: {totalValue}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {players.map((player) => (
            <div
              key={player.player.id}
              className="flex justify-between items-center p-2 bg-muted/50 rounded"
            >
              <div>
                <span className="font-medium">{player.player.name}</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  ({player.player.position})
                </span>
              </div>
              <span className="text-sm">{player.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
