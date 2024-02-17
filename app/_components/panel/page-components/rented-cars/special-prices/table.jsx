"use client"
import React, { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import DataTable from "@/app/_components/ui/data-table/data-table";
import DataTableHeader from "@/app/_components/ui/data-table/tata-table-header";
import { useSearchParams } from 'next/navigation'
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Message from "@/app/_components/ui/message";
import { PlusCircle } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card"
import AddRentedCarSpecialPrices from "./add-special-price";
import EditRentedCarSpecialPrices from "./edit-special-price";
import DeleteRentedCarSpecialPrices from "./delete-special-price-dialog";
import moment from "moment/moment";

const RentedCarSpecialPricesTable = ({ rentedCar }) => {
    const searchparam = useSearchParams();
    // Fetch special prices
    const { data, error, isPending, isSuccess } = useQuery({
        queryKey: ['rented-car-special-prices', rentedCar._id, searchparam.toString()],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/panel/rented-cars/${rentedCar._id}/special-prices?${searchparam.toString()}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        placeholderData: keepPreviousData
    })
    // Open state for add, edit and delete special price
    const [isAddRentedCarSpecialPricesOpen, setIsAddRentedCarSpecialPricesOpen] = useState(false)
    const [isEditRentedCarSpecialPricesOpen, setIsEditRentedCarSpecialPricesOpen] = useState(false)
    const [isDeleteRentedCarSpecialPricesOpen, setIsDeleteRentedCarSpecialPricesOpen] = useState(false)
    const [selectedRentedCarSpecialPrice, setSelectedRentedCarSpecialPrice] = useState()
    const columns = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Name" />
            ),
            cell: ({ row }) => (
                <div className="flex flex-col items-left justify-center">
                    <p className="text-base font-semibold">{row.original.name}</p>
                    <p className="text-sm text-foreground">Type : {row.original.rangeType}</p>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "date",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Applied on" />
            ),
            cell: ({ row }) => (
                row.original.rangeType == 'date' ?
                    <Badge variant='secondary' className='rounded-sm'>{moment(row.original.date.startDate).format("DD MMM YYYY")} to {moment(row.original.date.endDate).format("DD MMM YYYY")} </Badge>
                    : <Badge variant='secondary' className='rounded-sm capitalize'>{row.original.day}</Badge>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "price",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Price" />
            ),
            cell: ({ row }) => row.original.price,
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="flex gap-2 justify-end">
                    <Button onClick={() => { setSelectedRentedCarSpecialPrice(row.original); setIsEditRentedCarSpecialPricesOpen(true) }} variant='default' size='icon' className='w-8 h-8'><Pencil className='w-4 h-4' /></Button>
                    <Button onClick={() => { setSelectedRentedCarSpecialPrice(row.original); setIsDeleteRentedCarSpecialPricesOpen(true) }} variant='destructive' size='icon' className='w-8 h-8'><Trash className='w-4 h-4' /></Button>
                </div>
            ),
        },
    ];
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle size='lg' className='flex items-end gap-2 justify-between'>Special prices</CardTitle>
                    <CardDescription>
                        Special prices can be used to apply different prices to some specific days or dates.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Message variant={error ? 'destructive' : 'default'} message={error?.message} className='mt-3' />
                    {isPending && 'Loading...'}
                    {isSuccess &&
                        <DataTable
                            columns={columns}
                            data={data.rentedCarSpecialprices}
                            pageCount={data.pageCount}
                            filterableColumns={[
                                {
                                    id: "rangeType",
                                    title: "Applied type",
                                    options: [
                                        {
                                            label: 'On dates',
                                            value: 'date',
                                        },
                                        {
                                            label: 'On day',
                                            value: 'day',
                                        },
                                    ]
                                }
                            ]}
                            searchableColumns={[
                                {
                                    id: "name",
                                    title: 'Name',
                                    placeholder: "Enter name...",
                                }
                            ]}
                            tableOperations={<Button onClick={() => setIsAddRentedCarSpecialPricesOpen(true)} variant='default' size='sm' className='h-8'><PlusCircle className="mr-2 h-4 w-4" />Add special price</Button>}
                        />
                    }
                </CardContent>
            </Card>
            <AddRentedCarSpecialPrices open={isAddRentedCarSpecialPricesOpen} setOpen={setIsAddRentedCarSpecialPricesOpen} rentedCar={rentedCar} />
            {selectedRentedCarSpecialPrice && <EditRentedCarSpecialPrices open={isEditRentedCarSpecialPricesOpen} setOpen={setIsEditRentedCarSpecialPricesOpen} rentedCar={rentedCar} rentedCarSpecialPrice={selectedRentedCarSpecialPrice} />}
            {selectedRentedCarSpecialPrice && <DeleteRentedCarSpecialPrices open={isDeleteRentedCarSpecialPricesOpen} setOpen={setIsDeleteRentedCarSpecialPricesOpen} rentedCar={rentedCar} rentedCarSpecialPrice={selectedRentedCarSpecialPrice} />}
        </>
    );
}

export default RentedCarSpecialPricesTable;