"use client"
import React, { useState } from "react";
import {
    Pencil,
    MoreVertical,
    CheckCircle,
    XCircle
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
import DeleteCouponDialog from "./general/delete-dialog";
import Link from "next/link";
import AddCoupon from "./add";
import { PlusCircle } from 'lucide-react';
import { activeStatusOptions } from "@/app/_conf/constants/constant";
import { couponTypes, couponValidOns } from "@/app/_conf/constants/constant";
import moment from "moment";

const CouponsTable = () => {
    const { toast } = useToast();
    const searchparam = useSearchParams();
    // Fetch coupons
    const { data, error, isPending, isSuccess, refetch } = useQuery({
        queryKey: ['coupons', searchparam.toString()],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/panel/coupons?totalUsage=true&${searchparam.toString()}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        placeholderData: keepPreviousData
    })
    // Coupon mutate actions
    const { mutate: mutateCoupon } = useMutation({
        mutationFn: async ({ coupon, action }) => {
            try {
                const { data } = await axios.patch(`/api/panel/coupons/${coupon._id}`, { action: action.name, isActive: action.isActive })
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            refetch();
            toast({ description: `${variables.coupon.coupon} ${variables.action.isActive == true ? 'activated' : 'deactivated'} successfully.` });
        },
        onError: (error) => {
            toast({ description: error?.message, variant: 'destructive' })
        }
    })
    // Open state for add and delete coupon
    const [isAddCouponOpen, setIsAddCouponOpen] = useState(false)
    const [isDeleteCouponDialogOpen, setIsDeleteCouponDialogOpen] = useState(false)
    const [selectedCoupon, setSelectedCoupon] = useState()
    const columns = [
        {
            accessorKey: "coupon",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Coupon code" />
            ),
            cell: ({ row }) => (
                <div className="flex flex-col items-start gap-1">
                    <p className="text-base font-semibold uppercase">{row.original.coupon}</p>
                    {row.original.discountType == 'upto' && <Badge variant='default' className='rounded-sm'>Upto {row.original.price + '% upto ' + row.original.maxPrice}</Badge>}
                    {row.original.discountType == 'flat' && <Badge variant='default' className='rounded-sm'>Flat {row.original.price + (row.original.priceFormat == 'percentage' && '%')}</Badge>}
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "type",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Coupon type" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col gap-1">
                        {row.original.type != 'userOnly' && <p className="text-sm font-medium text-foreground">{couponTypes.find((couponType) => couponType.value == row.original.type).label} Coupon</p>}
                        {row.original.type == 'userOnly' && <Link href={`/panel/users/${row.original.user._id}`} className="flex gap-2 items-center">
                            <Avatar>
                                <AvatarImage src={row.original.user.image} alt={row.original.user.name} className='object-cover' />
                                <AvatarFallback>{row.original.user.name.slice(1)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <p className="text-sm font-normal">{row.original.user.name}</p>
                                <p className="text-sm font-medium">User only coupon</p>
                            </div>
                        </Link>}
                    </div>
                )
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "validOn",
            header: ({ column }) => (
                <DataTableHeader column={column} title="Valid on" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col gap-1">
                        {(() => {
                            switch (row.original.validOn) {
                                case 'tour':
                                    return <Link href={`/panel/tours/${row.original.tour._id}`} className="flex gap-2 items-center">
                                        <Avatar>
                                            <AvatarImage src={row.original.tour.images[0]} alt={row.original.tour.name} className='object-cover' />
                                            <AvatarFallback>{row.original.tour.name.slice(1)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-normal">{row.original.tour.name}</p>
                                            <p className="text-sm font-medium">Valid on this tour only</p>
                                        </div>
                                    </Link>;
                                case 'rentedCar':
                                    return <Link href={`/panel/rented-cars/${row.original.rentedCar._id}`} className="flex gap-2 items-center">
                                        <Avatar>
                                            <AvatarImage src={row.original.rentedCar.images[0]} alt={row.original.rentedCar.name} className='object-cover' />
                                            <AvatarFallback>{row.original.rentedCar.name.slice(1)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-normal">{row.original.rentedCar.name + ' ' + (row.original.rentedCar.modelYear || '')} {row.original.rentedCar.nickname && `(${row.original.rentedCar.nickname})`}</p>
                                            <p className="text-sm font-medium">Valid on this rented car only</p>
                                        </div>
                                    </Link>;
                                default:
                                    return <p className="text-sm font-medium">{couponValidOns.find((couponValidOn) => couponValidOn.value == row.original.validOn).label}</p>;
                            }
                        })()}
                    </div>
                )
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: 'maxUsage',
            header: ({ column }) => (
                <DataTableHeader column={column} title="Coupon usage" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium">Multiple usage</p>
                            {row.original.allowMultipleUsage ? <CheckCircle className="w-4 h-4 text-primary" /> : <XCircle className="w-4 h-4 text-destructive" />}
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium">Current usage</p>
                            {row.original.totalUsage || 0 + '/' + row.original.maxUsage}
                        </div>
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
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium">Status</p>
                            {row.original.isActive ? <CheckCircle className="w-4 h-4 text-primary" /> : <XCircle className="w-4 h-4 text-destructive" />}
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium">Expiration</p>
                            {moment(row.original.expirationDate).format('DD MMM YYYY')}
                        </div>
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
                    <Link href={`/panel/coupons/${row.original._id}`} passHref><Button variant='default' size='icon' className='w-8 h-8'><Pencil className='w-4 h-4' /></Button></Link>
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
                                        onValueChange={(value) => { mutateCoupon({ coupon: row.original, action: { name: 'isActive', isActive: value } }) }}
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
                                    setSelectedCoupon(row.original)
                                    setIsDeleteCouponDialogOpen(true)
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
                    data={data.coupons}
                    pageCount={data.pageCount}
                    filterableColumns={[
                        {
                            id: "type",
                            title: "Type",
                            options: couponTypes.map(option => ({
                                label: option.label,
                                value: option.value.toString(),
                            }))
                        },
                        {
                            id: "validOn",
                            title: "Valid on",
                            options: couponValidOns.map(option => ({
                                label: option.label,
                                value: option.value.toString(),
                            }))
                        },
                        {
                            id: "status",
                            title: "Status",
                            options: activeStatusOptions.map(option => ({
                                label: option.label,
                                value: option.value.toString(),
                            }))
                        },
                    ]}
                    searchableColumns={[
                        {
                            id: "coupon",
                            title: 'Coupon code',
                            placeholder: "Enter code...",
                        },
                        {
                            id: "user",
                            title: 'User',
                            placeholder: "Enter user name, email..",
                        },
                        {
                            id: "tour",
                            title: 'Tour',
                            placeholder: "Enter tour name...",
                        },
                        {
                            id: "rentedCar",
                            title: 'Rented car',
                            placeholder: "Enter car name, nickname...",
                        },
                    ]}
                    tableOperations={<Button onClick={() => setIsAddCouponOpen(true)} variant='default' size='sm' className='h-8'><PlusCircle className="mr-2 h-4 w-4" />Add coupon</Button>}
                />
            }
            <AddCoupon open={isAddCouponOpen} setOpen={setIsAddCouponOpen} />
            {selectedCoupon && <DeleteCouponDialog open={isDeleteCouponDialogOpen} setOpen={setIsDeleteCouponDialogOpen} coupon={selectedCoupon} />}
        </>
    );
}

export default CouponsTable;