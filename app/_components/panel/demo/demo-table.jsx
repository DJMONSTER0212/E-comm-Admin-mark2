"use client"
import React from "react";
import {
    ArrowDown,
    ArrowRight,
    ArrowUp,
    CheckCircle2,
    Circle,
    XCircle,
    MoreVertical,
    HelpCircle,
    Timer,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    DropdownMenuShortcut
} from "@/app/_components/ui/dropdown-menu";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Checkbox } from "@/app/_components/ui/checkbox";
import DataTable from "@/app/_components/ui/data-table/data-table";
import DataTableHeader from "@/app/_components/ui/data-table/tata-table-header";
import { PlusCircle } from "lucide-react";

const labels = [
    {
        value: "bug",
        label: "Bug",
    },
    {
        value: "feature",
        label: "Feature",
    },
    {
        value: "documentation",
        label: "Documentation",
    },
];

const DemoTable = () => {
    const columns = [
        {
            accessorKey: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                    className="translate-y-[2px] border-muted-foreground data-[state=checked]:border-none data-[state=checked]:bg-foreground data-[state=checked]:text-background"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px] border-muted-foreground data-[state=checked]:border-none data-[state=checked]:bg-foreground data-[state=checked]:text-background"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "code",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Task" />
            ),
            cell: ({ row }) => (
                <div className="w-[80px]">{row.getValue("code")}</div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "title",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Title" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex space-x-2">
                        {row.original.label && <Badge variant="outline" className='rounded-md'>{row.original.label}</Badge>}
                        <span className="max-w-[500px] truncate font-medium">
                            {row.getValue("title")}
                        </span>
                    </div>
                )
            },
            enableHiding: false,
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Status" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex w-[100px] items-center">
                        {row.getValue("status") === "canceled" ? (
                            <XCircle
                                className="mr-2 h-4 w-4 text-muted-foreground"
                                aria-hidden="true"
                            />
                        ) : row.getValue("status") === "done" ? (
                            <CheckCircle2
                                className="mr-2 h-4 w-4 text-muted-foreground"
                                aria-hidden="true"
                            />
                        ) : row.getValue("status") === "in-progress" ? (
                            <Timer
                                className="mr-2 h-4 w-4 text-muted-foreground"
                                aria-hidden="true"
                            />
                        ) : row.getValue("status") === "todo" ? (
                            <HelpCircle
                                className="mr-2 h-4 w-4 text-muted-foreground"
                                aria-hidden="true"
                            />
                        ) : (
                            <Circle
                                className="mr-2 h-4 w-4 text-muted-foreground"
                                aria-hidden="true"
                            />
                        )}
                        <span className="capitalize whitespace-nowrap">{row.getValue("status")}</span>
                    </div>
                )
            },
            filterFn: (row, id, value) => {
                return value instanceof Array && value.includes(row.getValue(id))
            },
        },
        {
            accessorKey: "priority",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Priority" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center">
                        {row.getValue("priority") === "low" ? (
                            <ArrowDown
                                className="mr-2 h-4 w-4 text-muted-foreground"
                                aria-hidden="true"
                            />
                        ) : row.getValue("priority") === "medium" ? (
                            <ArrowRight
                                className="mr-2 h-4 w-4 text-muted-foreground"
                                aria-hidden="true"
                            />
                        ) : row.getValue("priority") === "high" ? (
                            <ArrowUp
                                className="mr-2 h-4 w-4 text-muted-foreground"
                                aria-hidden="true"
                            />
                        ) : (
                            <Circle
                                className="mr-2 h-4 w-4 text-muted-foreground"
                                aria-hidden="true"
                            />
                        )}
                        <span className="capitalize">{row.getValue("priority")}</span>
                    </div>
                )
            },
            filterFn: (row, id, value) => {
                return value instanceof Array && value.includes(row.getValue(id))
            },
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            aria-label="Open menu"
                            variant="ghost"
                            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                        >
                            <MoreVertical className="h-4 w-4" aria-hidden="true" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Make a copy</DropdownMenuItem>
                        <DropdownMenuItem>Favorite</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup
                                    value={row.original.label}
                                    onValueChange={async (value) => {
                                        alert(JSON.stringify({
                                            id: row.original.id,
                                            label: value,
                                        }));
                                    }}
                                >
                                    {labels.map((label) => (
                                        <DropdownMenuRadioItem
                                            key={label.value}
                                            value={label.value}
                                        >
                                            {label.label}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            Delete
                            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];
    return (
        <div className="mx-4">
            <DataTable
                columns={columns}
                data={[
                    {
                        code: 'MKD67',
                        title: 'Clean the code of hotel website',
                        label: 'bug',
                        status: 'todo',
                        priority: 'high',
                    },
                    {
                        code: 'MKD68',
                        title: 'Fix bug in Invoice',
                        label: 'bug',
                        status: 'in-progress',
                        priority: 'high',
                    },
                    {
                        code: 'MKD69',
                        title: 'Filter option',
                        label: 'feature',
                        status: 'in-progress',
                        priority: 'medium',
                    },
                    {
                        code: 'MKD70',
                        title: 'New admin panel for next js websites',
                        label: 'feature',
                        status: 'done',
                        priority: 'high',
                    }
                ]}
                pageCount={1}
                filterableColumns={[
                    {
                        id: "status",
                        title: "Status",
                        options: [
                            {
                                label: 'Chomu',
                                value: '1',
                            },
                            {
                                label: 'Ghocu',
                                value: '2',
                            },
                        ]
                    },
                    {
                        id: "priority",
                        title: "Priority",
                        options: [
                            {
                                label: 'Low',
                                value: '0',
                            },
                            {
                                label: 'Medium',
                                value: '1',
                            },
                            {
                                label: 'High',
                                value: '2',
                            },
                        ],
                    },
                ]}
                searchableColumns={[
                    {
                        id: "title",
                        title: 'Task',
                        placeholder: "Enter task",
                    },
                    {
                        id: "code",
                        title: 'Code',
                        placeholder: "Enter code",
                    },
                ]}
                selectOperations={[
                    {
                        title: 'Delete',
                        className: 'bg-red-500 text-white',
                        operation: () => alert("Hey")
                    }
                ]}
                operations={<Button variant='default' size='sm' className='h-8'><PlusCircle className="mr-2 h-4 w-4" />Add new</Button>}
            />
        </div>
    );
}

export default DemoTable;