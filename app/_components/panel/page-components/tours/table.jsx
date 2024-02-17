"use client"
import React, { useState } from "react";
import {
    Pencil,
    Library,
    MoreVertical,
    MapPin,
    MapPinned,
    Clock1,
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
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/app/_components/ui/use-toast";
import DeleteTourDialog from "./general/delete-dialog";
import Link from "next/link";
import AddTour from "./add";
import { PlusCircle } from 'lucide-react';
import { activeStatusOptions, pinStatusOptions } from "@/app/_conf/constants/constant";

const ToursTable = () => {
    const { toast } = useToast();
    const searchparam = useSearchParams();
    // Fetch tour categories
    const { data: tourCategories, isPending: isTourCategoriesPending, isSuccess: isTourCategoriesSuccess } = useQuery({
        queryKey: ['tour-categories'],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/panel/tour-categories?all=true`,)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        placeholderData: []
    })
    // Fetch tours
    const { data, error, isPending, isSuccess, refetch } = useQuery({
        queryKey: ['tours', searchparam.toString()],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/panel/tours?${searchparam.toString()}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        placeholderData: keepPreviousData
    })
    // Tour mutate actions
    const { mutate: mutateTour } = useMutation({
        mutationFn: async ({ tour, action }) => {
            try {
                const { data } = await axios.patch(`/api/panel/tours/${tour._id}`, { action: action.name, isActive: action.isActive })
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            refetch();
            toast({ description: `${variables.tour.name} ${variables.action.isActive == true ? 'activated' : 'deactivated'} successfully.` });
        },
        onError: (error) => {
            toast({ description: error?.message, variant: 'destructive' })
        }
    })
    // Open state for add tour
    const [isAddTourOpen, setIsAddTourOpen] = useState(false)
    // Open state for delete alert
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
    const [selectedTour, setSelectedTour] = useState({})
    const columns = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Tour details" />
            ),
            cell: ({ row }) => (
                <div className="flex gap-2 items-center">
                    <Avatar>
                        <AvatarImage src={row.original.images[0]} alt={row.original.name} className='object-cover' />
                        <AvatarFallback>{row.original.name.slice(1)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <p className="text-base font-medium">{row.original.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{row.original.city.name + ', ' + row.original.state.name}, <span className="uppercase">{row.original.country.name}</span></p>
                    </div>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "duration",
            accessorFn: () => "Other details",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Other details" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium flex items-center gap-2 text-yellow-500"><Clock1 className="w-4 h-4" />{row.original.duration || 'Not set up'}</p>
                        <p className="text-sm font-medium flex items-center gap-2 text-green-700"><Library className="w-4 h-4" />{row.original.tourCategory.name || 'Not set up'}</p>
                    </div>
                )
            },
            enableSorting: false,
            enableHiding: true,
        },
        {
            id: 'startPoint',
            accessorFn: () => "Start-End points",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Start-End points" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col justify-start">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            {row.original.startPoint?.address ? row.original.startPoint.mapsLink ?
                                <Link href={row.original.startPoint.mapsLink} className="capitalize">{row.original.startPoint.address}</Link>
                                : <p className="capitalize">{row.original.startPoint.address}</p>
                                : <p className="capitalize text-muted-foreground">Not set up</p>
                            }
                        </div>
                        <div className="h-2 w-1 ml-[8px] border-l border-dashed border-primary"></div>
                        <div className="flex items-center gap-2">
                            <MapPinned className="w-4 h-4 text-primary" />
                            {row.original.endPoint?.address ? row.original.endPoint.mapsLink ?
                                <Link href={row.original.endPoint.mapsLink} className="capitalize">{row.original.endPoint.address}</Link>
                                : <p className="capitalize">{row.original.endPoint.address}</p>
                                : <p className="capitalize text-muted-foreground">Not set up</p>
                            }
                        </div>
                    </div>
                )
            },
            enableSorting: false,
            enableHiding: true,
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Status" />
            ),
            cell: ({ row }) => row.original.isActive ? <Badge>Activated</Badge> : <Badge variant="destructive">Deactivated</Badge>,
            filterFn: (row, id, value) => {
                return value instanceof Array && value.includes(row.getValue(id))
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="flex gap-2 justify-end">
                    <Link href={`/panel/tours/${row.original._id}`} passHref><Button variant='default' size='icon' className='w-8 h-8'><Pencil className='w-4 h-4' /></Button></Link>
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
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    <DropdownMenuRadioGroup
                                        value={row.original.isActive}
                                        onValueChange={(value) => { mutateTour({ tour: row.original, action: { name: 'isActive', isActive: value } }) }}
                                    >
                                        {activeStatusOptions.map((status) => (
                                            <DropdownMenuRadioItem
                                                key={status.value}
                                                value={status.value}
                                                className='cursor-pointer'
                                            >
                                                {status.label}
                                            </DropdownMenuRadioItem>
                                        ))}
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className='text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer'
                                onClick={() => {
                                    setSelectedTour(row.original)
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
                    data={data.tours}
                    pageCount={data.pageCount}
                    filterableColumns={[
                        {
                            id: "status",
                            title: "Status",
                            options: activeStatusOptions.map(option => ({
                                label: option.label,
                                value: option.value.toString(),
                            }))
                        },
                        {
                            id: "isPinOnNavbar",
                            title: "Pinned on navbar",
                            options: pinStatusOptions.map(option => ({
                                label: option.label,
                                value: option.value.toString(),
                            }))
                        },
                        {
                            id: "category",
                            title: "Category",
                            options: tourCategories.map((tourCategory) => { return { value: tourCategory._id, label: tourCategory.name } }),
                        },
                    ]}
                    searchableColumns={[
                        {
                            id: "name",
                            title: 'Name',
                            placeholder: "Enter name...",
                        },
                        {
                            id: "city",
                            title: 'City',
                            placeholder: "Enter city",
                        },
                        {
                            id: "state",
                            title: 'State',
                            placeholder: "Enter state",
                        },
                        {
                            id: "country",
                            title: 'Country',
                            placeholder: "Enter country",
                        },
                    ]}
                    tableOperations={<Button onClick={() => setIsAddTourOpen(true)} variant='default' size='sm' className='h-8'><PlusCircle className="mr-2 h-4 w-4" />Add tour</Button>}
                />
            }
            <AddTour open={isAddTourOpen} setOpen={setIsAddTourOpen} />
            <DeleteTourDialog open={isDeleteAlertOpen} setOpen={setIsDeleteAlertOpen} tour={selectedTour} />
        </>
    );
}

export default ToursTable;