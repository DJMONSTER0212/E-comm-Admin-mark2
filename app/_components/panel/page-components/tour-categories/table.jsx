"use client"
import React, { useState } from "react";
import {
    Pencil,
    MoreVertical,
    Pin,
    PinOff
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import DataTable from "@/app/_components/ui/data-table/data-table";
import DataTableHeader from "@/app/_components/ui/data-table/tata-table-header";
import { useSearchParams } from 'next/navigation'
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Message from "@/app/_components/ui/message";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar"
import DeleteTourCategoryDialog from "./delete-dialog";
import AddTourCategory from "./add";
import EditTourCategory from "./edit";
import { PlusCircle } from 'lucide-react';
import { pinStatusOptions } from "@/app/_conf/constants/constant";

const TourCategoriesTable = () => {
    const searchparam = useSearchParams();
    // Fetch tour categories
    const { data, error, isPending, isSuccess, refetch } = useQuery({
        queryKey: ['tour-categories', searchparam.toString()],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/panel/tour-categories?${searchparam.toString()}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        placeholderData: keepPreviousData
    })
    // Open state for add, delete and edit tour category
    const [isAddTourCategoryOpen, setIsAddTourCategoryOpen] = useState(false)
    const [isEditTourCategoryOpen, setIsEditTourCategoryOpen] = useState(false)
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
    const [selectedTourCategory, setSelectedTourCategory] = useState({})
    const columns = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Category details" />
            ),
            cell: ({ row }) => (
                <div className="flex gap-2 items-center">
                    <Avatar>
                        <AvatarImage src={row.original.image} alt={row.original.name} />
                        <AvatarFallback>{row.original.name.slice(1)}</AvatarFallback>
                    </Avatar>
                    <p className="text-base font-medium">{row.original.name}</p>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "stats",
            accessorFn: () => "stats",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Stats" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex flex-wrap gap-1">
                        <Badge className='bg-green-500 font-normal whitespace-nowrap'>5 Tours</Badge>
                    </div>
                )
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "isPinOnNavbar",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Pin on navbar" />
            ),
            cell: ({ row }) => row.original.isPinOnNavbar ? <p className='text-positive text-base flex gap-2 items-center whitespace-nowrap'><Pin className="w-4 h-4 text-positive" />{pinStatusOptions.find(option => option.value === true).label}</p> : <p className='text-destructive text-base flex gap-2 items-center whitespace-nowrap'><PinOff className="w-4 h-4 text-destructive" />{pinStatusOptions.find(option => option.value === false).label}</p>,
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "isPinOnFilters",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Pin on filter" />
            ),
            cell: ({ row }) => row.original.isPinOnFilters ? <p className='text-positive text-base flex gap-2 items-center whitespace-nowrap'><Pin className="w-4 h-4 text-positive" />{pinStatusOptions.find(option => option.value === true).label}</p> : <p className='text-destructive text-base flex gap-2 items-center whitespace-nowrap'><PinOff className="w-4 h-4 text-destructive" />{pinStatusOptions.find(option => option.value === false).label}</p>,
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="flex gap-2 justify-end">
                    <Button onClick={() => { setSelectedTourCategory(row.original); setIsEditTourCategoryOpen(true) }} variant='default' size='icon' className='w-8 h-8'><Pencil className='w-4 h-4' /></Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                aria-label="Open menu"
                                variant="secondary"
                                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                            >
                                <MoreVertical className="h-4 w-4" aria-hidden="true" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem>View tours</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className='text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer'
                                onClick={() => {
                                    setSelectedTourCategory(row.original)
                                    setIsDeleteAlertOpen(true)
                                }}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];
    return (
        <>
            <Message variant={error ? 'destructive' : 'default'} message={error?.message} className='mt-3' />
            {isPending && 'Loading...'}
            {isSuccess &&
                <DataTable
                    columns={columns}
                    data={data.tourCategories}
                    pageCount={data.pageCount}
                    filterableColumns={[
                        {
                            id: "isPinOnNavbar",
                            title: "Pinned on navbar",
                            options: pinStatusOptions.map(option => ({
                                label: option.label,
                                value: option.value.toString(),
                            }))
                        },
                        {
                            id: "isPinOnFilters",
                            title: "Pinned on filters",
                            options: pinStatusOptions.map(option => ({
                                label: option.label,
                                value: option.value.toString(),
                            }))
                        }
                    ]}
                    searchableColumns={[
                        {
                            id: "name",
                            title: 'Name',
                            placeholder: "Enter name...",
                        }
                    ]}
                    tableOperations={<Button onClick={() => setIsAddTourCategoryOpen(true)} variant='default' size='sm' className='h-8'><PlusCircle className="mr-2 h-4 w-4" />Add tour category</Button>}
                />
            }
            <AddTourCategory open={isAddTourCategoryOpen} setOpen={setIsAddTourCategoryOpen} />
            {selectedTourCategory && <DeleteTourCategoryDialog open={isDeleteAlertOpen} setOpen={setIsDeleteAlertOpen} tourCategory={selectedTourCategory} />}
            {selectedTourCategory && <EditTourCategory open={isEditTourCategoryOpen} setOpen={setIsEditTourCategoryOpen} tourCategory={selectedTourCategory} />}
        </>
    );
}

export default TourCategoriesTable;