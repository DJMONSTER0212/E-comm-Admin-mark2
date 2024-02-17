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
import DeleteContactLeadDialog from "./delete-dialog";
import ViewContactLead from "./view";
import { leadContactServices, leadStatuses } from "@/app/_conf/constants/constant";
import fileDownload from "js-file-download";
import moment from "moment";

const ContactLeadsTable = () => {
    const { toast } = useToast();
    const searchparam = useSearchParams();
    // Fetch contact lead
    const { data, error, isPending, isSuccess, refetch } = useQuery({
        queryKey: ['contact-leads', searchparam.toString()],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/panel/contact-leads?${searchparam.toString()}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        placeholderData: keepPreviousData
    })
    // Contact lead export
    const { isLoading: isExportedContactLeadsLoading, refetch: refetchExportedContactLeads } = useQuery({
        queryKey: ['export-contact-leads', searchparam.toString()],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/panel/contact-leads?all=true&export=true&${searchparam.toString()}`)
                fileDownload(data, 'contact-leads.csv')
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        enabled: false
    })
    const exportContactLeads = () => {
        refetchExportedContactLeads();
    };
    // Mutate contact lead
    const { mutate: mutateContactLead } = useMutation({
        mutationFn: async ({ contactLead, status }) => {
            try {
                const { data } = await axios.patch(`/api/panel/contact-leads/${contactLead._id}`, { status })
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
    // Open state for delete and view contact lead
    const [isViewContactLeadOpen, setIsViewContactLeadOpen] = useState(false)
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
    const [selectedContactLead, setSelectedContactLead] = useState()
    const columns = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Lead" />
            ),
            cell: ({ row }) => row.original.name,
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
            accessorKey: "service",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Service" />
            ),
            cell: ({ row }) => leadContactServices.find((service) => service.value == row.original.service).label,
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
                    <Button onClick={() => { setSelectedContactLead(row.original); setIsViewContactLeadOpen(true) }} variant='default' size='icon' className='w-8 h-8'><Pencil className='w-4 h-4' /></Button>
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
                                        onValueChange={(value) => { mutateContactLead({ contactLead: row.original, status: value }) }}
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
                                    setSelectedContactLead(row.original)
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
                    data={data.contactLeads}
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
                    ]}
                    tableOperations={<Button onClick={exportContactLeads} variant='default' size='sm' className='h-8'>{isExportedContactLeadsLoading ? <Loader2 className={`mr-2 h-4 w-4 animate-spin`} /> : <Download className={`mr-2 h-4 w-4`} />}Export listed leads</Button>}
                />
            }
            {selectedContactLead && <DeleteContactLeadDialog open={isDeleteAlertOpen} setOpen={setIsDeleteAlertOpen} contactLead={selectedContactLead} />}
            {selectedContactLead && <ViewContactLead open={isViewContactLeadOpen} setOpen={setIsViewContactLeadOpen} contactLead={selectedContactLead} />}
        </>
    );
}

export default ContactLeadsTable;