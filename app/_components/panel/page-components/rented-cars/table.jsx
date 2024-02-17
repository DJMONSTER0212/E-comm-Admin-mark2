"use client"
import React, { useState } from "react";
import {
    Pencil,
    Library,
    MoreVertical,
    MapPin,
    MapPinned,
    Hash,
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
import DeleteRentedCarDialog from "./general/delete-dialog";
import Link from "next/link";
import AddRentedCar from "./add";
import { PlusCircle } from 'lucide-react';
import { activeStatusOptions } from "@/app/_conf/constants/constant";
import { carCategories } from "@/app/_conf/constants/constant";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/app/_components/ui/hover-card"


const RentedCarsTable = () => {
    const { toast } = useToast();
    const searchparam = useSearchParams();
    // Fetch rented cars
    const { data, error, isPending, isSuccess, refetch } = useQuery({
        queryKey: ['rented-cars', searchparam.toString()],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/panel/rented-cars?${searchparam.toString()}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        placeholderData: keepPreviousData
    })
    // Rented car mutate actions
    const { mutate: mutateRentedCar } = useMutation({
        mutationFn: async ({ rentedCar, action }) => {
            try {
                const { data } = await axios.patch(`/api/panel/rented-cars/${rentedCar._id}`, { action: action.name, isActive: action.isActive })
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            refetch();
            toast({ description: `${variables.rentedCar.name} ${variables.action.isActive == true ? 'activated' : 'deactivated'} successfully.` });
        },
        onError: (error) => {
            toast({ description: error?.message, variant: 'destructive' })
        }
    })
    // Open state for add rented car
    const [isAddRentedCarOpen, setIsAddRentedCarOpen] = useState(false)
    // Open state for delete alert
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
    const [selectedRentedCar, setSelectedRentedCar] = useState({})
    const columns = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Rented car details" />
            ),
            cell: ({ row }) => (
                <div className="flex gap-2 items-center">
                    <Avatar>
                        <AvatarImage src={row.original.images[0]} alt={row.original.name} className='object-cover' />
                        <AvatarFallback>{row.original.name.slice(1)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <p className="text-base font-medium">{row.original.name + ' ' + (row.original.modelYear || '')} {row.original.nickname && `(${row.original.nickname})`}</p>
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
                        <p className="text-sm font-medium flex items-center gap-2 text-yellow-500"><Hash className="w-4 h-4" />{row.original.number || 'Not set up'}</p>
                        <p className="text-sm font-medium flex items-center gap-2 text-green-700"><Library className="w-4 h-4" />{carCategories.find((carCategory) => carCategory.value == row.original.carCategory).label} by {row.original.carCompany.name}</p>
                    </div>
                )
            },
            enableSorting: false,
            enableHiding: true,
        },
        {
            id: 'startPoints',
            accessorFn: () => "Start-End points",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Start-End points" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col justify-start">
                        <div className="flex items-center gap-2">
                            <HoverCard>
                                <HoverCardTrigger className="flex gap-2 items-center">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    {row.original.startPoints && row.original.startPoints.length > 0 ?
                                        <p className="capitalize">{row.original.startPoints.length} available</p>
                                        : <p className="capitalize text-muted-foreground">Not set up</p>
                                    }
                                </HoverCardTrigger>
                                <HoverCardContent>
                                    <p className="font-medium text-base">Start points</p>
                                    <div className="mt-2 flex flex-col gap-1">
                                        {row.original.startPoints.length > 0 ?
                                            row.original.startPoints.map((startPoint, index) => (
                                                <div key={index} className="flex gap-2 items-center">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                    <Link href={startPoint.mapsLink} className="capitalize">{startPoint.address}</Link>
                                                </div>
                                            ))
                                            : <p className='mb-5 text-base text-muted-foreground'>No start point found.</p>
                                        }
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        </div>
                        <div className="h-2 w-1 ml-[8px] border-l border-dashed border-primary"></div>
                        <div className="flex items-center gap-2">
                            <HoverCard>
                                <HoverCardTrigger className="flex gap-2 items-center">
                                    <MapPinned className="w-4 h-4 text-primary" />
                                    {row.original.endPoints && row.original.endPoints.length > 0 ?
                                        <p className="capitalize">{row.original.endPoints.length} available</p>
                                        : <p className="capitalize text-muted-foreground">Not set up</p>
                                    }
                                </HoverCardTrigger>
                                <HoverCardContent>
                                    <p className="font-medium text-base">End points</p>
                                    <div className="mt-2 flex flex-col gap-1">
                                        {row.original.endPoints.length > 0 ?
                                            row.original.endPoints.map((endPoint, index) => (
                                                <div key={index} className="flex gap-2 items-center">
                                                    <MapPinned className="w-4 h-4 text-primary" />
                                                    <Link href={endPoint.mapsLink} className="capitalize">{endPoint.address}</Link>
                                                </div>
                                            ))
                                            : <p className='mb-5 text-base text-muted-foreground'>No start point found.</p>
                                        }
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
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
                    <Link href={`/panel/rented-cars/${row.original._id}`} passHref><Button variant='default' size='icon' className='w-8 h-8'><Pencil className='w-4 h-4' /></Button></Link>
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
                                        onValueChange={(value) => { mutateRentedCar({ rentedCar: row.original, action: { name: 'isActive', isActive: value } }) }}
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
                                    setSelectedRentedCar(row.original)
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
                    data={data.rentedCars}
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
                            id: "carCategory",
                            title: "Car category",
                            options: carCategories.map((carCategory) => { return { value: carCategory.value, label: carCategory.label } }),
                        },
                    ]}
                    searchableColumns={[
                        {
                            id: "name",
                            title: 'Name',
                            placeholder: "Enter name...",
                        },
                        {
                            id: "nickname",
                            title: 'Nickname',
                            placeholder: "Enter nickname...",
                        },
                        {
                            id: "number",
                            title: 'Car number',
                            placeholder: "Enter car number...",
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
                    tableOperations={<Button onClick={() => setIsAddRentedCarOpen(true)} variant='default' size='sm' className='h-8'><PlusCircle className="mr-2 h-4 w-4" />Add rented car</Button>}
                />
            }
            <AddRentedCar open={isAddRentedCarOpen} setOpen={setIsAddRentedCarOpen} />
            <DeleteRentedCarDialog open={isDeleteAlertOpen} setOpen={setIsDeleteAlertOpen} rentedCar={selectedRentedCar} />
        </>
    );
}

export default RentedCarsTable;