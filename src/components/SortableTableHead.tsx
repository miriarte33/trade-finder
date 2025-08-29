import { TableHead } from "@/components/ui/table";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import type { SortField, SortOrder } from "@/contexts/LeagueDetailsContext";

interface SortableTableHeadProps {
  field: SortField;
  currentSortBy: SortField;
  currentSortOrder: SortOrder;
  onSort: (field: SortField) => void;
  children: React.ReactNode;
  className?: string;
}

export function SortableTableHead({
  field,
  currentSortBy,
  currentSortOrder,
  onSort,
  children,
  className,
}: SortableTableHeadProps) {
  const isActive = currentSortBy === field;
  
  return (
    <TableHead 
      className={`cursor-pointer select-none hover:bg-muted/50 ${className || ''}`}
      onClick={() => onSort(field)}
    >
      {children}
      {!isActive && (
        <ChevronsUpDown className="inline ml-1 h-4 w-4 text-muted-foreground/50" />
      )}
      {isActive && currentSortOrder === 'asc' && (
        <ChevronUp className="inline ml-1 h-4 w-4" />
      )}
      {isActive && currentSortOrder === 'desc' && (
        <ChevronDown className="inline ml-1 h-4 w-4" />
      )}
    </TableHead>
  );
}