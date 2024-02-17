import { X, Check } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import DataTableFilter from "./data-table-filter";
import DataTableViewOptions from "./data-table-view-options";
import { Separator } from "@/app/_components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/_components/ui/select"
import { useState } from "react";
import DataTableDateFilter from "./data-table-date-filter";
import { Filter } from "lucide-react";
import { Badge } from "../badge";
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
import { cn } from "@/app/_lib/utils";

const DataTableToolbar = ({ table, filterableColumns = [], searchableColumns = [], rangeableColumns = [], tableOperations, columnFilters, setColumnFilters }) => {
    // Check default selected searchable column (If any)
    const checkDefaultSearchableColumn = () => {
        for (const column of searchableColumns) {
            const filter = columnFilters.filter((columnFilter) => columnFilter.id == column.id);
            if (filter.length > 0) {
                return filter[0].id
            }
        }
    }
    const [activeColumn, setActiveColumn] = useState(checkDefaultSearchableColumn() || searchableColumns[0]?.id)
    // Set filter value
    const setFilter = (column, value) => {
        if (value) {
            // Check if the filter for the column already exists
            const updatedFilters = columnFilters.map((filter) => {
                if (filter.id === column) {
                    // If it exists, update the key's value
                    return { ...filter, value: value };
                }
                return filter;
            });

            // If the filter doesn't exist, add a new one
            if (!updatedFilters.some((filter) => filter.id === column)) {
                updatedFilters.push({ id: column, value: value });
            }

            // Update the state with the new filters
            setColumnFilters(updatedFilters);
        } else {
            // If the value is empty, remove the filter for the column
            setColumnFilters(prevFilters => prevFilters.filter((filter) => filter.id !== column));
        }
    };
    // For filters [Rangeable and searchable]
    const searchableColumnIds = searchableColumns.map((searchableColumn) => searchableColumn.id);
    const [selectedFilters, setSelectedFilters] = useState(columnFilters.filter(columnFilter => !searchableColumnIds.includes(columnFilter.id)).map(columnFilter => columnFilter.id) || [])
    const isFiltered = columnFilters.filter((columnFilter) => !searchableColumnIds.includes(columnFilter.id)).length > 0;
    const clearFilters = () => {
        setColumnFilters((prevColumnFilters) => prevColumnFilters.filter((columnFilter) => searchableColumnIds.includes(columnFilter.id)))
    }
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between py-1 px-1">
                <div className="flex flex-wrap items-center gap-2 w-full">
                    {/* Search logics >>>>>>>>>> */}
                    {searchableColumns.length == 1 ?
                        table.getColumn(searchableColumns[0]?.id ? String(searchableColumns[0]?.id) : "") && (
                            <Input
                                placeholder={searchableColumns[0]?.placeholder}
                                value={
                                    columnFilters.filter((columnFilter) => columnFilter.id == searchableColumns[0]?.id)[0]?.value || ''
                                }
                                onChange={(event) => setFilter(searchableColumns[0]?.id, event.target.value)}
                                className="h-8 w-full md:w-[150px] lg:w-[250px] border-dashed"
                            />
                        )
                        : searchableColumns.length > 1 &&
                        <div className="w-full md:w-auto flex border border-dashed focus-within:border-collapse h-8 rounded-md focus-within:bg-muted">
                            <Select value={activeColumn} onValueChange={(value) => {
                                setActiveColumn(value);
                                for (let column of searchableColumns) {
                                    setFilter(column.id, '')
                                }
                            }}

                            >
                                <SelectTrigger className="w-fit gap-2 h-8 px-2 lg:px-3 border-0 bg-transparent data-[state=open]:bg-muted rounded-none rounded-l-md focus:ring-0 focus:ring-offset-0 focus:border-b-2 focus:border-ring focus:rounded-none">
                                    <SelectValue placeholder={searchableColumns.filter((column) => column.id == activeColumn)[0].title} />
                                </SelectTrigger>
                                <SelectContent>
                                    {searchableColumns.length > 0 &&
                                        searchableColumns.map((column) =>
                                            <SelectItem key={String(column.id)} value={column.id}>
                                                {column.title}
                                            </SelectItem>
                                        )}
                                </SelectContent>
                            </Select>
                            <Separator orientation='vertical' className='h-8 bg-muted' />
                            <Input
                                placeholder={searchableColumns.filter((column) => column.id == activeColumn)[0].placeholder}
                                value={columnFilters.filter((columnFilter) => columnFilter.id == activeColumn)[0]?.value || ''}
                                onChange={(event) => setFilter(activeColumn, event.target.value)}
                                className="h-8 w-full md:w-[150px] lg:w-[250px] border-0 bg-transparent focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-ring focus-visible:rounded-none focus-visible:ring-offset-0"
                            />
                        </div>
                    }
                    {/* Filter clear >>>>>>>>>> */}
                    {[...filterableColumns, ...rangeableColumns].length > 0 &&
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="h-8 px-2 lg:px-3 border-dashed">
                                    <Filter className='w-4 h-4 mr-2' />
                                    Filters
                                    {(isFiltered || selectedFilters.length > 0) &&
                                        <>
                                            <Separator orientation="vertical" className="mx-2 h-4" />
                                            <Badge variant='secondary' className="px-1 rounded-sm font-normal">{selectedFilters.length}</Badge>
                                        </>
                                    }
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0" align="start">
                                <Command>
                                    <CommandGroup>
                                        <div className="flex items-center justify-between gap-2 px-1 h-6">
                                            <p className="text-sm font-medium">Filters</p>
                                            {(isFiltered || selectedFilters.length > 0) && <Button onClick={() => { clearFilters(); setSelectedFilters([]) }} variant='outline' size='icon' className='h-6 w-6'><X className="w-4 h-4" /></Button>}
                                        </div>
                                    </CommandGroup>
                                    <CommandSeparator />
                                    <CommandList>
                                        <CommandEmpty>No results found.</CommandEmpty>
                                        <CommandGroup>
                                            {[...filterableColumns, ...rangeableColumns].map((column) => {
                                                const isSelected = selectedFilters.includes(column.id);
                                                return (
                                                    <CommandItem
                                                        key={column.id}
                                                        onSelect={() => {
                                                            if (isSelected) {
                                                                setSelectedFilters(prevFilters => prevFilters.filter((filter) => filter != column.id));
                                                                setFilter(column.id, '')
                                                            } else {
                                                                setSelectedFilters(prevFilters => [...prevFilters, column.id]);
                                                            }
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
                                                        <span>{column.title}</span>
                                                    </CommandItem>
                                                );
                                            })}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    }
                    <div className="flex-1"></div>
                    <DataTableViewOptions table={table} />
                    {/* Table operations >>>>>>>>>> */}
                    {tableOperations}
                </div>
            </div>
            {/* Filters >>>>>>>>>> */}
            {selectedFilters.length > 0 && <div className="flex gap-2 overflow-auto">
                {/* // Filter logics >>>>>>>>>> */}
                {filterableColumns.length > 0 &&
                    filterableColumns.map(
                        (column) => selectedFilters.includes(column.id) &&
                            <DataTableFilter
                                key={String(column.id)}
                                setFilter={setFilter}
                                columnFilters={columnFilters}
                                column={String(column.id)}
                                title={column.title}
                                options={column.options}
                                setSelectedFilters={setSelectedFilters}
                            />
                    )
                }
                {/* // Range Filter logics >>>>>>>>>> */}
                {rangeableColumns.length > 0 &&
                    rangeableColumns.map(
                        (column) => selectedFilters.includes(column.id) &&
                            <DataTableDateFilter
                                key={String(column.id)}
                                setFilter={setFilter}
                                columnFilters={columnFilters}
                                column={String(column.id)}
                                title={column.title}
                                setSelectedFilters={setSelectedFilters}
                            />
                    )
                }
            </div>}
        </div>
    );
}

export default DataTableToolbar;
