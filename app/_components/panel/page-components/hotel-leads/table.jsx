"use client"
import React, { useState } from "react";
import {
    Pencil,
    MoreVertical,
    Mail,
    Phone,
    Sparkles,
    CheckCheck,
    Loader,
    CheckCircle,
    X,
    Download,
    Clock,
    Loader2,
    LocateIcon,
    Calendar,
    MapPin
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
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/app/_components/ui/use-toast";
import DeleteHotelLeadDialog from "./delete-dialog";
import ViewHotelLead from "./view";
import { leadStatuses } from "@/app/_conf/constants/constant";
import fileDownload from "js-file-download";
import moment from "moment";

const HotelLeadsTable = () => {
    const { toast } = useToast();
    const searchparam = useSearchParams();
    // Fetch hotel lead
    const { data, error, isPending, isSuccess, refetch } = useQuery({
        queryKey: ['hotel-leads', searchparam.toString()],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/panel/hotel-leads?${searchparam.toString()}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        placeholderData: keepPreviousData
    })
    // Hotel lead export
    const { isLoading: isExportedHotelLeadsLoading, refetch: refetchExportedHotelLeads } = useQuery({
        queryKey: ['export-hotel-leads', searchparam.toString()],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/panel/hotel-leads?all=true&export=true&${searchparam.toString()}`)
                fileDownload(data, 'hotel-leads.csv')
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        enabled: false
    })
    const exportHotelLeads = () => {
        refetchExportedHotelLeads();
    };
    // Mutate hotel lead
    const { mutate: mutateHotelLead } = useMutation({
        mutationFn: async ({ hotelLead, status }) => {
            try {
                const { data } = await axios.patch(`/api/panel/hotel-leads/${hotelLead._id}`, { status })
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            refetch();
            toast({ description: `Lead status has been update successfully.` });
        },
        onError: (error) => {
            toast({ description: error?.message, variant: 'destructive' })
        }
    })
    // Open state for delete and view hotel lead
    const [isViewHotelLeadOpen, setIsViewHotelLeadOpen] = useState(false)
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
    const [selectedHotelLead, setSelectedHotelLead] = useState()
    const columns = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Lead" />
            ),
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <p className="text-base font-medium">{row.original.name}</p>
                    {row.original.guests && <p className="text-sm font-normal text-muted-foreground">Guests : <span className="lowercase">{row.original.guests}</span></p>}
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "email",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Contact info" />
            ),
            cell: ({ row }) => (
                <div className="grid grid-cols-1 gap-1">
                    <div className="flex gap-3 items-center">
                        <Mail className='w-4 h-4' />
                        <p className='text-sm'>{row.original.email || <span className='text-xs text-muted-foreground'>Not available</span>}</p>
                    </div>
                    <div className="flex gap-3 items-center">
                        <Phone className='w-4 h-4' />
                        <p className='text-sm'>{row.original.phone || <span className='text-xs text-muted-foreground'>Not available</span>}</p>
                    </div>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "country",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Want hotel" />
            ),
            cell: ({ row }) => <div className="grid grid-cols-1 gap-1">
                <div className="flex gap-3 items-center">
                    <MapPin className='w-4 h-4' />
                    <p className='text-sm'>{row.original.city + ', ' + row.original.country || <span className='text-xs text-muted-foreground'>Not available</span>}</p>
                </div>
                <div className="flex gap-3 items-center">
                    <Calendar className='w-4 h-4' />
                    <p className='text-sm'>{moment(row.original.checkIn).format('DD MMM YYYY') + ' to ' + moment(row.original.checkOut).format('DD MMM YYYY') || <span className='text-xs text-muted-foreground'>Not available</span>}</p>
                </div>
            </div>,
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Status" />
            ),
            cell: ({ row }) => {
                switch (row.original.status) {
                    case 'new':
                        return (<Badge className='flex items-center gap-2 w-fit' variant='default'><Sparkles className="w-3 h-3" />{leadStatuses.find((status) => status.value == row.original.status).label}</Badge>);
                    case 'read':
                        return (<Badge className='flex items-center gap-2 w-fit' variant='default'><CheckCheck className="w-3 h-3" />{leadStatuses.find((status) => status.value == row.original.status).label}</Badge>);
                    case 'inProgress':
                        return (<Badge className='flex items-center gap-2 w-fit' variant='default'><Clock className="w-3 h-3" />{leadStatuses.find((status) => status.value == row.original.status).label}</Badge>);
                    case 'complete':
                        return (<Badge className='flex items-center gap-2 w-fit' variant='default'><CheckCircle className="w-3 h-3" />{leadStatuses.find((status) => status.value == row.original.status).label}</Badge>);
                    case 'notImportant':
                        return (<Badge className='flex items-center gap-2 w-fit' variant='default'><X className="w-3 h-3" />{leadStatuses.find((status) => status.value == row.original.status).label}</Badge>);
                    default:
                        return <></>;
                }
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="flex gap-2 justify-end">
                    <Button onClick={() => { setSelectedHotelLead(row.original); setIsViewHotelLeadOpen(true) }} variant='default' size='icon' className='w-8 h-8'><Pencil className='w-4 h-4' /></Button>
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
                                        value={row.original.status}
                                        onValueChange={(value) => { mutateHotelLead({ hotelLead: row.original, status: value }) }}
                                    >
                                        {leadStatuses.map((status) => (
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
                                    setSelectedHotelLead(row.original)
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
                    data={data.hotelLeads}
                    pageCount={data.pageCount}
                    filterableColumns={[
                        {
                            id: "status",
                            title: "Status",
                            options: leadStatuses.map(option => ({
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
                        },
                        {
                            id: "email",
                            title: 'Email',
                            placeholder: "Enter email...",
                        },
                        {
                            id: "phone",
                            title: 'Phone',
                            placeholder: "Enter phone...",
                        },
                        {
                            id: "country",
                            title: 'Country',
                            placeholder: "Enter country...",
                        },
                        {
                            id: "city",
                            title: 'City',
                            placeholder: "Enter city...",
                        }
                    ]}
                    rangeableColumns={[
                        {
                            id: 'dates',
                            title: 'Check In - Check Out',
                            range: 'date',
                        }
                    ]}
                    tableOperations={<Button onClick={exportHotelLeads} variant='default' size='sm' className='h-8'>{isExportedHotelLeadsLoading ? <Loader2 className={`mr-2 h-4 w-4 animate-spin`} /> : <Download className={`mr-2 h-4 w-4`} />}Export listed leads</Button>}
                />
            }
            {selectedHotelLead && <DeleteHotelLeadDialog open={isDeleteAlertOpen} setOpen={setIsDeleteAlertOpen} hotelLead={selectedHotelLead} />}
            {selectedHotelLead && <ViewHotelLead open={isViewHotelLeadOpen} setOpen={setIsViewHotelLeadOpen} hotelLead={selectedHotelLead} />}
        </>
    );
}

export default HotelLeadsTable;