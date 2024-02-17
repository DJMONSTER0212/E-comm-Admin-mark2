"use client"
import React, { useState } from "react";
import {
    Pencil,
    KeyRound,
    Construction,
    MoreVertical,
    BadgeCheck
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
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/app/_components/ui/use-toast";
import DeleteUserDialog from "./delete-dialog";
import Link from "next/link";
import AddUser from "./add";
import { PlusCircle } from 'lucide-react';
import { useSession } from "next-auth/react";
import { userRoles } from "@/app/_conf/constants/constant";
import { blockStatusOptions } from "@/app/_conf/constants/constant";

const UsersTable = () => {
    const { data: session } = useSession();
    const { toast } = useToast();
    const searchparam = useSearchParams();
    // Fetch users
    const { data, error, isPending, isSuccess, refetch } = useQuery({
        queryKey: ['users', searchparam.toString()],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/panel/users?${searchparam.toString()}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        placeholderData: keepPreviousData
    })
    // User mutate actions
    const { mutate: mutateUser } = useMutation({
        mutationFn: async ({ user, action }) => {
            try {
                const { data } = await axios.patch(`/api/panel/users/${user._id}`, { action: action.name, isBlock: action.isBlock })
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            refetch();
            toast({ description: `${variables.user.name} ${variables.action.isBlock == true ? 'blocked' : 'Unblocked'} successfully.` });
        },
        onError: (error) => {
            toast({ description: error?.message, variant: 'destructive' })
        }
    })
    // Open state for add and delete user
    const [isAddUserOpen, setIsAddUserOpen] = useState(false)
    const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState()
    const columns = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableHeader column={column} title="User details" />
            ),
            cell: ({ row }) => (
                <div className="flex gap-2 items-center">
                    <Avatar>
                        <AvatarImage src={row.original.image} alt={row.original.name} />
                        <AvatarFallback>{row.original.name.slice(1)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <p className="text-base font-medium">{row.original.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{row.original.role}</p>
                    </div>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "email",
            accessorFn: () => "Contact details",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Contact details" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">{row.original.email}</p>
                        {row.original?.phone && <p className="text-sm text-muted-foreground">{row.original.phone}</p>}
                    </div>
                )
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Status" />
            ),
            cell: ({ row }) => {
                return (
                    <>
                        {row.original.isBlock ? <Badge variant="destructive">Blocked</Badge> : <Badge>Active</Badge>}
                    </>)
            },
            filterFn: (row, id, value) => {
                return value instanceof Array && value.includes(row.getValue(id))
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: 'signedInWith',
            accessorFn: () => "Signed in with",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Signed in with" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex gap-1 flex-col">
                        <div className="flex items-center">
                            {row.original.signedInWith === "google" ? (
                                <Image
                                    className="mr-2 h-4 w-4"
                                    src='/panel/images/google.png'
                                    height={50}
                                    width={50}
                                    alt='Goolge'
                                />
                            ) : row.original.signedInWith === "credentials" && (
                                <KeyRound
                                    className="mr-2 h-4 w-4 text-foreground"
                                    aria-hidden="true"
                                />
                            )}
                            <p className="capitalize">{row.original.signedInWith}</p>
                        </div>
                        {row.original.isBlock ? <p className='text-destructive text-sm flex gap-2 items-center'><Construction className="w-4 h-4 text-destructive" />Not verified</p> : <p className='text-positive text-sm flex gap-2 items-center'><BadgeCheck className="w-4 h-4 text-positive" />Verified</p>}
                    </div>
                )
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="flex gap-2 justify-end">
                    <Button variant='default' size='icon' className='w-8 h-8' asChild><Link href={`/panel/users/${row.original._id}`} passHref><Pencil className='w-4 h-4' /></Link></Button>
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
                                        value={row.original.isBlock}
                                        onValueChange={(value) => { mutateUser({ user: row.original, action: { name: 'isBlock', isBlock: value } }) }}
                                    >
                                        {blockStatusOptions.map((status) => (
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
                                    setSelectedUser(row.original)
                                    setIsDeleteUserDialogOpen(true)
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
                    data={data.users}
                    pageCount={data.pageCount}
                    filterableColumns={[
                        {
                            id: "status",
                            title: "Status",
                            options: blockStatusOptions.map(option => ({
                                label: option.label,
                                value: option.value.toString(),
                            }))
                        },
                        {
                            id: "role",
                            title: "Role",
                            options: [
                                ...(session?.user?.role === 'sadmin' ? [{
                                    label: 'Super admin',
                                    value: 'sadmin',
                                }] : []),
                                ...userRoles.slice(1),
                            ],
                        },
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
                            placeholder: "Enter email",
                        },
                        {
                            id: "phone",
                            title: 'Phone',
                            placeholder: "Enter phone",
                        },
                    ]}
                    rangeableColumns={[
                        {
                            id: 'createdAt',
                            title: 'Joined b/w',
                            range: 'date',
                        }
                    ]}
                    tableOperations={<Button onClick={() => setIsAddUserOpen(true)} variant='default' size='sm' className='h-8'><PlusCircle className="mr-2 h-4 w-4" />Add user</Button>}
                />
            }
            <AddUser open={isAddUserOpen} setOpen={setIsAddUserOpen} />
            {selectedUser && <DeleteUserDialog open={isDeleteUserDialogOpen} setOpen={setIsDeleteUserDialogOpen} user={selectedUser} />}
        </>
    );
}

export default UsersTable;