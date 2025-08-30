import type { Position } from "@/lib/types";
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select";
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
  const options: MultiSelectOption[] = POSITIONS.map((position) => ({
    value: position,
    label: `${position} - ${POSITION_LABELS[position]}`,
    disabled: disabledPositions.has(position),
  }));

  const handleChange = (selected: Set<string>) => {
    onChange(new Set(Array.from(selected) as Position[]));
  };

  const placeholder = variant === "include" 
    ? selectedPositions.size === 0 
      ? "All positions included" 
      : `${selectedPositions.size} position${selectedPositions.size > 1 ? 's' : ''} selected`
    : selectedPositions.size === 0 
      ? "No positions excluded" 
      : `${selectedPositions.size} position${selectedPositions.size > 1 ? 's' : ''} excluded`;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="text-sm font-medium">{title}</label>
      <MultiSelect
        options={options}
        selected={new Set(Array.from(selectedPositions) as string[])}
        onChange={handleChange}
        placeholder={placeholder}
        searchPlaceholder="Search positions..."
        emptyText="No positions found"
        maxCount={3}
      />
    </div>
  );
}
