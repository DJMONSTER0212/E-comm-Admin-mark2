import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { EyeOff } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/app/_components/ui/dropdown-menu";

const DataTableViewOptions = ({ table }) => {
    const hideAbleColumns = table.getAllColumns().filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
    return (
        <>
            {hideAbleColumns.length > 0 &&
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="ml-auto h-8 flex data-[state=open]:bg-muted"
                        >
                            <EyeOff className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-auto">
                        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {hideAbleColumns.map((column) => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {typeof column.columnDef.accessorFn == 'function' ? column.columnDef.accessorFn() : column.id}
                                </DropdownMenuCheckboxItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            }
        </>
    );
}

export default DataTableViewOptions;
