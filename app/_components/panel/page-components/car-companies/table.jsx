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
import { CarFront } from "lucide-react";
import Image from "next/image";
import DeleteCarCompanyDialog from "./delete-dialog";
import AddCarCompany from "./add";
import EditCarCompany from "./edit";
import { PlusCircle } from 'lucide-react';
import { pinStatusOptions } from "@/app/_conf/constants/constant";

const CarCompaniesTable = () => {
    const searchparam = useSearchParams();
    // Fetch car companies
    const { data, error, isPending, isSuccess } = useQuery({
        queryKey: ['car-companies', searchparam.toString()],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/panel/car-companies?${searchparam.toString()}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        placeholderData: keepPreviousData
    })
    // Open state for add, delete and edit car-company
    const [isAddCarCompanyOpen, setIsAddCarCompanyOpen] = useState(false)
    const [isEditCarCompanyOpen, setIsEditCarCompanyOpen] = useState(false)
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
    const [selectedCarCompany, setSelectedCarCompany] = useState({})
    const columns = [
        {
            accessorKey: "name",
            header: ({ column }) => <DataTableHeader column={column} title="Company details" />,
            cell: ({ row }) => (
                <div className="flex gap-2 items-center">
                    {row.original.image ?
                        <Image src={row.original.image} alt={row.original.name} width={100} height={100} className='max-w-[100%] max-h-10 min-h-[2.5rem] rounded-md'></Image>
                        :
                        <CarFront className='w-10 h-10 text-foreground p-1.5 rounded-md' />
                    }
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
                        <Badge className='bg-green-500 font-normal whitespace-nowrap'>{row.original.totalRentedCars || 0} Rented cars</Badge>
                    </div>
                )
            },
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
                    <Button onClick={() => { setSelectedCarCompany(row.original); setIsEditCarCompanyOpen(true) }} variant='default' size='icon' className='w-8 h-8'><Pencil className='w-4 h-4' /></Button>
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
                            <DropdownMenuItem>View rented cars</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className='text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer'
                                onClick={() => {
                                    setSelectedCarCompany(row.original)
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
                    data={data.carCompanies}
                    pageCount={data.pageCount}
                    filterableColumns={[
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
                    tableOperations={<Button onClick={() => setIsAddCarCompanyOpen(true)} variant='default' size='sm' className='h-8'><PlusCircle className="mr-2 h-4 w-4" />Add car company</Button>}
                />
            }
            <AddCarCompany open={isAddCarCompanyOpen} setOpen={setIsAddCarCompanyOpen} />
            {selectedCarCompany && <DeleteCarCompanyDialog open={isDeleteAlertOpen} setOpen={setIsDeleteAlertOpen} carCompany={selectedCarCompany} />}
            {selectedCarCompany && <EditCarCompany open={isEditCarCompanyOpen} setOpen={setIsEditCarCompanyOpen} carCompany={selectedCarCompany} />}
        </>
    );
}

export default CarCompaniesTable;