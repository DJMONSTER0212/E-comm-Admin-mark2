import React from 'react';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    EyeOff,
} from "lucide-react";
import { cn } from '@/app/_lib/utils';
import { Button } from "@/app/_components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";

const DataTableHeader = ({ column, title, className }) => {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>;
    }

    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8 data-[state=open]:bg-accent"
                    >
                        <span>{title}</span>
                        {column.getIsSorted() === "desc" ? (
                            <ArrowDown className="ml-2 h-4 w-4" aria-hidden="true" />
                        ) : column.getIsSorted() === "asc" ? (
                            <ArrowUp className="ml-2 h-4 w-4" aria-hidden="true" />
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4" aria-hidden="true" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem
                        onClick={() => column.toggleSorting(false)}
                    >
                        <ArrowUp
                            className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                            aria-hidden="true"
                        />
                        Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => column.toggleSorting(true)}
                    >
                        <ArrowDown
                            className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                            aria-hidden="true"
                        />
                        Desc
                    </DropdownMenuItem>
                    {(typeof column.accessorFn !== "undefined" && column.getCanHide()) &&
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => column.toggleVisibility(false)}
                            >
                                <EyeOff
                                    className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                                    aria-hidden="true"
                                />
                                Hide
                            </DropdownMenuItem>
                        </>
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export default DataTableHeader;
