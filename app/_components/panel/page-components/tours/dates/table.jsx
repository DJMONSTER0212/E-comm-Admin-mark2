"use client"
import React, { useState } from "react";
import {
    Pencil,
    MoreVertical,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { PlusCircle } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card"
import AddTourDate from "./add-date";
import EditTourdate from "./edit-date";
import DeleteTourDateDialog from "./delete-date-dialog";
import moment from "moment/moment";

const TourDatesTable = ({ tour }) => {
    const searchparam = useSearchParams();
    // Fetch tour dates
    const { data, error, isPending, isSuccess } = useQuery({
        queryKey: ['tour-dates', tour._id, searchparam.toString()],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/panel/tours/${tour._id}/tour-dates?${searchparam.toString()}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        placeholderData: keepPreviousData
    })
    // Open state for add, edit and delete tour date
    const [isAddTourDateOpen, setIsAddTourDateOpen] = useState(false)
    const [isEditTourDateOpen, setIsEditTourDateOpen] = useState(false)
    const [isDeleteTourDateDialogOpen, setIsDeleteTourDateDialogOpen] = useState(false)
    const [selectedTourDate, setSelectedTourDate] = useState()
    const columns = [
        {
            accessorKey: "date",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Date" />
            ),
            cell: ({ row }) => (
                <div className="flex flex-col items-left justify-center">
                    <p className="text-2xl font-semibold">{moment(row.original.date).format('DD')}</p>
                    <p className="text-sm text-foreground uppercase">{moment(row.original.date).format('MMM')}</p>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "times",
            accessorFn: () => "Times",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Times" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex flex-wrap gap-1">
                        {row.original.times.slice(0, 2).map((time, index) => (
                            <Badge key={index} variant='secondary' className='rounded-md'>{time}</Badge>
                        ))}
                        {row.original.times.length > 2 && <Badge variant='secondary' className='rounded-md'>{row.original.times.length - 2} + more</Badge>}
                    </div>
                )
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "sharedTour",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Shared tour" />
            ),
            cell: ({ row }) => {
                return (
                    <>
                        {(row.original.sharedTour?.isActive || row.original.sharedTour?.price || row.original.sharedTour?.maxPerson) ?
                            <div className="flex gap-2">
                                {row.original.sharedTour?.isActive ?
                                    <Badge className={'w-5 p-0 flex justify-center items-center'} style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}>Active</Badge>
                                    :
                                    <Badge variant={'destructive'} className={'w-5 p-0 flex justify-center items-center'} style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}>Inactive</Badge>
                                }
                                <div className="flex flex-col">
                                    <p className="text-base text-foreground whitespace-nowrap"><span className="font-semibold">Price :</span> ₹ {row.original.sharedTour.price}</p>
                                    <div className="flex gap-2">
                                        <p className="text-base text-foreground whitespace-nowrap"><span className="font-semibold">Max.P :</span> {row.original.sharedTour.maxPerson}</p>
                                    </div>
                                </div>
                            </div> :
                            <div className="flex flex-col">
                                <p className="capitalize text-muted-foreground">Not set up</p>
                            </div>
                        }
                    </>
                )
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "privateTour",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Private tour" />
            ),
            cell: ({ row }) => {
                return (
                    <>
                        {(row.original.privateTour?.isActive || row.original.privateTour?.price || row.original.privateTour?.maxPerson) ?
                            <div className="flex gap-2">
                                {row.original.privateTour?.isActive ?
                                    <Badge className={'w-5 p-0 flex justify-center items-center'} style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}>Active</Badge>
                                    :
                                    <Badge variant={'destructive'} className={'w-5 p-0 flex justify-center items-center'} style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}>Inactive</Badge>
                                }
                                <div className="flex flex-col">
                                    <p className="text-base text-foreground whitespace-nowrap"><span className="font-semibold">Price :</span> ₹ {row.original.privateTour.price}</p>
                                    <div className="flex gap-2">
                                        <p className="text-base text-foreground whitespace-nowrap"><span className="font-semibold">Min.P :</span> {row.original.privateTour.minPerson}</p>
                                        <p className="text-base text-foreground whitespace-nowrap"><span className="font-semibold">Max.P :</span> {row.original.privateTour.maxPerson}</p>
                                    </div>
                                </div>
                            </div> :
                            <div className="flex flex-col">
                                <p className="capitalize text-muted-foreground">Not set up</p>
                            </div>
                        }
                    </>
                )
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="flex gap-2 justify-end">
                    <Button onClick={() => { setSelectedTourDate(row.original); setIsEditTourDateOpen(true) }} variant='default' size='icon' className='w-8 h-8'><Pencil className='w-4 h-4' /></Button>
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
                            <DropdownMenuItem
                                className='text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer'
                                onClick={() => {
                                    setSelectedTourDate(row.original)
                                    setIsDeleteTourDateDialogOpen(true)
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
            <Card>
                <CardHeader>
                    <CardTitle size='lg' className='flex items-end gap-2 justify-between'>Tour dates</CardTitle>
                    <CardDescription>Tour dates are the dates on which bookings for this tour are available.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Message variant={error ? 'destructive' : 'default'} message={error?.message} className='mt-3' />
                    {isPending && 'Loading...'}
                    {isSuccess &&
                        <DataTable
                            columns={columns}
                            data={data.tourDates}
                            pageCount={data.pageCount}
                            filterableColumns={[
                                {
                                    id: "status",
                                    title: "Status",
                                    options: [
                                        {
                                            label: 'Active',
                                            value: 'true',
                                        },
                                        {
                                            label: 'Inactive',
                                            value: 'false',
                                        },
                                    ]
                                },
                                {
                                    id: "type",
                                    title: "Tour type",
                                    options: [
                                        {
                                            label: 'Shared',
                                            value: 'shared',
                                        },
                                        {
                                            label: 'Private',
                                            value: 'private',
                                        },
                                    ]
                                }
                            ]}
                            searchableColumns={[
                                {
                                    id: "times",
                                    title: 'Time',
                                    placeholder: "Time Ex: 20:00",
                                }
                            ]}
                            rangeableColumns={[
                                {
                                    id: 'dates',
                                    title: 'Dates b/w',
                                    range: 'date',
                                }
                            ]}
                            tableOperations={<Button onClick={() => setIsAddTourDateOpen(true)} variant='default' size='sm' className='h-8'><PlusCircle className="mr-2 h-4 w-4" />Add date</Button>}
                        />
                    }
                </CardContent>
            </Card>
            <AddTourDate open={isAddTourDateOpen} setOpen={setIsAddTourDateOpen} tour={tour} />
            {selectedTourDate && <EditTourdate open={isEditTourDateOpen} setOpen={setIsEditTourDateOpen} tour={tour} tourDate={selectedTourDate} />}
            {selectedTourDate && <DeleteTourDateDialog open={isDeleteTourDateDialogOpen} setOpen={setIsDeleteTourDateDialogOpen} tour={tour} tourDate={selectedTourDate} />}
        </>
    );
}

export default TourDatesTable;