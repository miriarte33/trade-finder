import type { Position } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface PositionFilterProps {
  title: string;
  selectedPositions: Set<Position>;
  disabledPositions: Set<Position>;
  onChange: (positions: Set<Position>) => void;
  variant: "include" | "exclude";
  className?: string;
}

const POSITIONS: Position[] = ["QB", "RB", "WR", "TE", "PICK"];

const POSITION_LABELS: Record<Position, string> = {
  QB: "Quarterback",
  RB: "Running Back",
  WR: "Wide Receiver",
  TE: "Tight End",
  PICK: "Draft Pick",
};

export function PositionFilter({
  title,
  selectedPositions,
  disabledPositions,
  onChange,
  variant,
  className,
}: PositionFilterProps) {
  const handleToggle = (position: Position, checked: boolean) => {
    const newPositions = new Set(selectedPositions);
    if (checked) {
      newPositions.add(position);
    } else {
      newPositions.delete(position);
    }
    onChange(newPositions);
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {POSITIONS.map((position) => {
          const isDisabled = disabledPositions.has(position);
          const isChecked = selectedPositions.has(position);

          return (
            <div key={position} className="flex items-center space-x-2">
              <Checkbox
                id={`${variant}-${position}`}
                checked={isChecked}
                disabled={isDisabled}
                onCheckedChange={(checked) =>
                  handleToggle(position, checked as boolean)
                }
              />
              <label
                htmlFor={`${variant}-${position}`}
                className={cn(
                  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed",
                  isDisabled && "opacity-50"
                )}
              >
                <span className="font-semibold">{position}</span> -{" "}
                {POSITION_LABELS[position]}
              </label>
            </div>
          );
        })}
        {selectedPositions.size === 0 && (
          <p className="text-xs text-muted-foreground">
            {variant === "include"
              ? "All positions will be considered"
              : "No positions will be excluded"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
