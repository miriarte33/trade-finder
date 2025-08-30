import * as React from "react";
import { CheckIcon, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: Set<string>;
  onChange: (selected: Set<string>) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
  maxCount?: number;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  searchPlaceholder = "Search...",
  emptyText = "No options found.",
  className,
  disabled,
  maxCount = 3,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    const newSelected = new Set(selected);
    if (selected.has(value)) {
      newSelected.delete(value);
    } else {
      newSelected.add(value);
    }
    onChange(newSelected);
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selected);
    newSelected.delete(value);
    onChange(newSelected);
  };

  const selectedArray = Array.from(selected);
  const displayCount = Math.min(selectedArray.length, maxCount);
  const remainingCount = selectedArray.length - displayCount;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            "h-auto min-h-9 px-3 py-2",
            className
          )}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedArray.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                {selectedArray.slice(0, displayCount).map((value) => {
                  const option = options.find((opt) => opt.value === value);
                  return (
                    <Badge
                      key={value}
                      variant="secondary"
                      className="mr-1"
                      onClick={(e) => handleRemove(value, e)}
                    >
                      {option?.label || value}
                      <X className="ml-1 h-3 w-3 cursor-pointer" />
                    </Badge>
                  );
                })}
                {remainingCount > 0 && (
                  <Badge variant="secondary">+{remainingCount}</Badge>
                )}
              </>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  disabled={option.disabled}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.has(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}