import React, { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card"
import { ReactSortable } from "react-sortablejs";
import { PlusCircle, Check, X, MoreVertical, ArrowUpDown } from 'lucide-react';
import { Button } from '@/app/_components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import AddInclude from './add-include';
import DeleteIncludeDialog from './delete-include-dialog';
import EditInclude from './edit-include';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/app/_components/ui/use-toast';

const RentedCarIncludes = ({ rentedCar }) => {
    const queryClient = useQueryClient();
    const { toast } = useToast()
    const [includesOrder, setIncludesOrder] = useState(rentedCar.includes || [])
    // Rented car include sort function
    const { mutate: sortIncludes } = useMutation({
        mutationFn: async () => {
            try {
                const { data } = await axios.patch(`/api/panel/rented-cars/${rentedCar._id}/includes/`, { action: 'sort', includes: includesOrder })
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            toast({ description: `Include items has been sorted successfully.` })
            queryClient.invalidateQueries({
                queryKey: ['rented-cars', rentedCar._id],
            })
        },
        onError: (error) => {
            toast({ description: error.message, variant: 'destructive' })
        }
    })
    // Open state for add, edit, delete and selected include item
    const [isAddIncludeOpen, setIsAddIncludeOpen] = useState(false)
    const [isEditIncludeOpen, setIsEditIncludeOpen] = useState(false)
    const [isDeleteIncludeDialogOpen, setIsDeleteIncludeDialogOpen] = useState(false)
    const [selectedInclude, setSelectedInclude] = useState()
    // Update includes order state on change in rented car
    useEffect(() => {
        if (rentedCar) {
            setIncludesOrder(rentedCar.includes)
        }
    }, [rentedCar])
    return (
        <>
            <div className='lg:col-span-2'>
                <Card>
                    <CardHeader>
                        <CardTitle size='lg'>What{"'s"} included in the rented car</CardTitle>
                        <CardDescription>Write all the items, rules, services, etc which are or are not included in <span className='text-foreground font-medium'>{rentedCar.name}</span> rented car.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {includesOrder.length > 0 ? <ReactSortable
                            list={includesOrder}
                            setList={(sortedIncludes) => { setIncludesOrder(sortedIncludes) }}
                            onEnd={sortIncludes}
                            handle=".drag-btn"
                            className={"grid grid-cols-1 items-start gap-3 mb-5"}
                        >
                            {includesOrder.map((item) => (
                                <div key={item._id} className="flex justify-between gap-2">
                                    <div className="flex items-start gap-2">
                                        {item.isIncluded ? <Check className="w-5 h-5 min-w-[1.25rem]" />
                                            : <X className="w-5 h-5 min-w-[1.25rem]" />}
                                        <p className='text-foreground text-base'>{item.title}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="drag-btn flex h-8 w-8 p-0 data-[state=open]:bg-muted cursor-move">
                                            <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    aria-label="Open menu"
                                                    variant="outline"
                                                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                                                >
                                                    <MoreVertical className="h-4 w-4" aria-hidden="true" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-auto">
                                                <DropdownMenuItem onClick={() => { setSelectedInclude(item); setIsEditIncludeOpen(true) }}>Edit</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className='text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer'
                                                    onClick={() => { setSelectedInclude(item); setIsDeleteIncludeDialogOpen(true) }}
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </ReactSortable >
                            : <p className='mb-5 text-base text-muted-foreground'>No include items found. Please add one.</p>
                        }
                        <Button onClick={() => setIsAddIncludeOpen(true)} variant='default' className='w-full'><PlusCircle className="w-5 h-5 mr-2" />Add new</Button>
                    </CardContent>
                </Card>
            </div>
            <AddInclude open={isAddIncludeOpen} setOpen={setIsAddIncludeOpen} rentedCar={rentedCar} />
            {selectedInclude && <EditInclude open={isEditIncludeOpen} setOpen={setIsEditIncludeOpen} rentedCar={rentedCar} include={selectedInclude} />}
            {selectedInclude && <DeleteIncludeDialog open={isDeleteIncludeDialogOpen} setOpen={setIsDeleteIncludeDialogOpen} rentedCar={rentedCar} include={selectedInclude} />}
        </>
    )
}

export default RentedCarIncludes