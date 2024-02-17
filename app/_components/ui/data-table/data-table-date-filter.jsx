import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, X } from "lucide-react";
import { cn } from "@/app/_lib/utils";
import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/_components/ui/popover";
import { Separator } from "../separator";
import { Badge } from "../badge";

const DataTableDateFilter = ({ column, title, columnFilters, setFilter, setSelectedFilters }) => {
    const [date, setDate] = useState({
        from: columnFilters.filter((columnFilter) => columnFilter.id == column)[0]?.value[0] && new Date(columnFilters.filter((columnFilter) => columnFilter.id == column)[0]?.value[0]),
        to: columnFilters.filter((columnFilter) => columnFilter.id == column)[0]?.value[1] && new Date(columnFilters.filter((columnFilter) => columnFilter.id == column)[0]?.value[1])
    } || {});
    // Empty the dat state if column filters get reset
    useEffect(() => {
        if (Object.keys(columnFilters).length == 0 && Object.keys(date).length > 0) {
            setDate({})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnFilters])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant="outline"
                    size="sm"
                    className={cn(
                        "h-7 text-xs data-[state=open]:bg-muted rounded-full",
                        !date && "text-muted-foreground"
                    )}

                >
                    <>
                        {title}
                        {(date?.from && date.to) &&
                            <>
                                <Separator orientation="vertical" className="mx-2 h-4" />
                                <Badge variant='secondary' className='hidden lg:block font-normal rounded-md'>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </Badge>
                                <Badge variant='secondary' className='lg:hidden font-normal rounded-sm px-1'>
                                    <Check className="w-4 h-4 text-foreground" />
                                </Badge>
                            </>
                        }
                    </>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="flex items-center justify-between gap-2 mx-2 my-1 h-6">
                    <p className="text-sm font-medium">{title}</p>
                    {(date?.from && date.to) && (<Button onClick={() => { setFilter(column, null); setSelectedFilters(prevFilters => prevFilters.filter((filter) => filter != column)) }} variant='outline' size='icon' className='h-6 w-6'><X className="w-4 h-4" /></Button>)}
                </div>
                <Separator />
                <Calendar
                    captionLayout="dropdown"
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={(selectedDate) => {
                        setDate(selectedDate);
                        if (selectedDate?.from && selectedDate?.to) {
                            setFilter(column, [selectedDate.from, selectedDate.to])
                        }
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}

export default DataTableDateFilter;