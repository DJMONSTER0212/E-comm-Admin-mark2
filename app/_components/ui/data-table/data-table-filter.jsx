import React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/app/_lib/utils";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/app/_components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/app/_components/ui/popover";
import { Separator } from "@/app/_components/ui/separator";

const DataTableFilter = ({ column, title, options, columnFilters, setFilter, setSelectedFilters }) => {
    const selectedValues = new Set(columnFilters.filter((columnFilter) => columnFilter.id == column)[0]?.value || []);
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 text-xs data-[state=open]:bg-muted rounded-full">
                    <>
                        {/* <Filter className="mr-2 h-4 w-4" /> */}
                        {title}
                        {selectedValues?.size > 0 && (
                            <>
                                <Separator orientation="vertical" className="mx-2 h-4" />
                                <Badge
                                    variant="secondary"
                                    className="rounded-sm px-1 font-normal lg:hidden"
                                >
                                    {selectedValues.size}
                                </Badge>
                                <div className="hidden space-x-1 lg:flex">
                                    {selectedValues.size > 2 ? (
                                        <Badge
                                            variant="secondary"
                                            className="rounded-sm px-1 font-normal"
                                        >
                                            {selectedValues.size} selected
                                        </Badge>
                                    ) : (
                                        options.filter((option) => selectedValues.has(option.value))
                                            .map((option) => (
                                                <Badge
                                                    variant="secondary"
                                                    key={option.value}
                                                    className="rounded-sm px-1 font-normal"
                                                >
                                                    {option.label}
                                                </Badge>
                                            ))
                                    )}
                                </div>
                            </>
                        )}
                    </>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <Command >
                    <CommandList>
                        <CommandGroup>
                            <div className="flex items-center justify-between gap-2 px-1 h-6">
                                <p className="text-sm font-medium">{title}</p>
                                {selectedValues.size > 0 && (<Button onClick={() => { setFilter(column, null); setSelectedFilters(prevFilters => prevFilters.filter((filter) => filter != column)) }} variant='outline' size='icon' className='h-6 w-6'><X className="w-4 h-4" /></Button>)}
                            </div>
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = selectedValues.has(option.value);
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                            if (isSelected) {
                                                selectedValues.delete(option.value);
                                            } else {
                                                selectedValues.add(option.value);
                                            }
                                            const filterValues = Array.from(selectedValues);
                                            setFilter(column, filterValues.length ? filterValues : null);
                                        }}
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-muted-foreground",
                                                isSelected
                                                    ? "bg-foreground text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}
                                        >
                                            <Check className={cn("h-4 w-4")} aria-hidden="true" />
                                        </div>
                                        {option.icon && (
                                            <option.icon
                                                className="mr-2 h-4 w-4 text-muted-foreground"
                                                aria-hidden="true"
                                            />
                                        )}
                                        <span>{option.label}</span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default DataTableFilter;