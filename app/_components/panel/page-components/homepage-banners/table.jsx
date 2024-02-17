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
import DeleteHomepageBannerDialog from "./delete-dialog";
import AddHomepageBanner from "./add";
import EditHomepageBanner from "./edit";
import { PlusCircle } from 'lucide-react';
import Link from "next/link";
import { activeStatusOptions } from "@/app/_conf/constants/constant";

const HomepageBannersTable = () => {
    const { toast } = useToast();
    const searchparam = useSearchParams();
    // Fetch homepage banner
    const { data, error, isPending, isSuccess, refetch } = useQuery({
        queryKey: ['homepage-banners', searchparam.toString()],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/panel/homepage-banners?${searchparam.toString()}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        placeholderData: keepPreviousData
    })
    // Homepage banner mutate actions
    const { mutate: mutateHomepageBanner } = useMutation({
        mutationFn: async ({ homepageBanner, isActive }) => {
            try {
                const { data } = await axios.patch(`/api/panel/homepage-banners/${homepageBanner._id}`, { isActive })
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            refetch();
            toast({ description: `Banner has been ${variables.isActive == true ? 'activated' : 'deactivated'} successfully.` });
        },
        onError: (error) => {
            toast({ description: error?.message, variant: 'destructive' })
        }
    })
    // Open state for add, delete and edit homepage banner
    const [isAddHomepageBannerOpen, setIsAddHomepageBannerOpen] = useState(false)
    const [isEditHomepageBannerOpen, setIsEditHomepageBannerOpen] = useState(false)
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
    const [selectedHomepageBanner, setSelectedHomepageBanner] = useState({})
    const columns = [
        {
            accessorKey: "title",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Banner details" />
            ),
            cell: ({ row }) => (
                <div className="flex gap-2 items-center">
                    <Avatar>
                        <AvatarImage src={row.original.image} alt={row.original.title} className='rounded-md w-20 h-36' />
                        <AvatarFallback>{row.original.title.slice(1)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <p className="text-base font-medium">{row.original.title}</p>
                        <p className="text-sm font-normal text-muted-foreground">{row.original.shortDesc}</p>
                    </div>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "btnTitle",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Target btn" />
            ),
            cell: ({ row }) => (
                <>
                    {(row.original.btnTitle && row.original.link) ? <Link href={row.original.link}><Button size='sm'>{row.original.btnTitle}</Button></Link> : <span className="text-muted-foreground">Not set up</span>}
                </>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Status" />
            ),
            cell: ({ row }) => row.original.isActive ? <Badge>Activated</Badge> : <Badge variant="destructive">Deactivated</Badge>,
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="flex gap-2 justify-end">
                    <Button onClick={() => { setSelectedHomepageBanner(row.original); setIsEditHomepageBannerOpen(true) }} variant='default' size='icon' className='w-8 h-8'><Pencil className='w-4 h-4' /></Button>
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
                                        onValueChange={(value) => { mutateHomepageBanner({ homepageBanner: row.original, isActive: value }) }}
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
                                    setSelectedHomepageBanner(row.original)
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
                    data={data.homepageBanners}
                    pageCount={data.pageCount}
                    filterableColumns={[
                        {
                            id: "status",
                            title: "Status",
                            options: activeStatusOptions.map(option => ({
                                label: option.label,
                                value: option.value.toString(),
                            }))
                        }
                    ]}
                    searchableColumns={[
                        {
                            id: "title",
                            title: 'Title',
                            placeholder: "Enter title...",
                        }
                    ]}
                    tableOperations={<Button onClick={() => setIsAddHomepageBannerOpen(true)} variant='default' size='sm' className='h-8'><PlusCircle className="mr-2 h-4 w-4" />Add homepage banner</Button>}
                />
            }
            <AddHomepageBanner open={isAddHomepageBannerOpen} setOpen={setIsAddHomepageBannerOpen} />
            {selectedHomepageBanner && <DeleteHomepageBannerDialog open={isDeleteAlertOpen} setOpen={setIsDeleteAlertOpen} homepageBanner={selectedHomepageBanner} />}
            {selectedHomepageBanner && <EditHomepageBanner open={isEditHomepageBannerOpen} setOpen={setIsEditHomepageBannerOpen} homepageBanner={selectedHomepageBanner} />}
        </>
    );
}

export default HomepageBannersTable;