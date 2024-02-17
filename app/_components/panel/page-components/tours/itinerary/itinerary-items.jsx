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
import AddItineraryItem from './add-itinerary-item';
import DeleteItineraryItemDialog from './delete-itinerary-item-dialog';
import EditItineraryItem from './edit-itinerary-item';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/app/_components/ui/use-toast';

const TourItineraryItems = ({ tour }) => {
    const queryClient = useQueryClient();
    const { toast } = useToast()
    const [itineraryItemsOrder, setItineraryItemsOrder] = useState(tour.itineraryItems || [])
    // Tour itinerary items sort function
    const { mutate: sortItineraryItems } = useMutation({
        mutationFn: async () => {
            try {
                const { data } = await axios.patch(`/api/panel/tours/${tour._id}/itinerary-items/`, { action: 'sort', itineraryItems: itineraryItemsOrder })
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            toast({ description: `Itinerary items items has been sorted successfully.` })
            queryClient.invalidateQueries({
                queryKey: ['tour', tour._id],
            })
        },
        onError: (error) => {
            toast({ description: error.message, variant: 'destructive' })
        }
    })
    // Open state for add, edit, delete and selected itinerary item
    const [isAddItineraryItemOpen, setIsAddItineraryItemOpen] = useState(false)
    const [isEditItineraryItemOpen, setIsEditItineraryItemOpen] = useState(false)
    const [isDeleteItineraryItemDialogOpen, setIsDeleteItineraryItemDialogOpen] = useState(false)
    const [selectedItineraryItem, setSelectedItineraryItem] = useState()
    // Update itinerary items Order state on change in tour
    useEffect(() => {
        if (tour) {
            setItineraryItemsOrder(tour.itineraryItems)
        }
    }, [tour])
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle size='lg'>Tour itinerary steps</CardTitle>
                    <CardDescription>Itinerary steps contains all the steps or path which you will follow in <span className='text-foreground font-medium'>{tour.name}</span> tour.</CardDescription>
                </CardHeader>
                <CardContent>
                    {itineraryItemsOrder.length > 0 ? <ReactSortable
                        list={itineraryItemsOrder}
                        setList={(sortedItineraryItems) => { setItineraryItemsOrder(sortedItineraryItems) }}
                        onEnd={sortItineraryItems}
                        handle=".drag-btn"
                        className={"relative border-s-2 border-foreground mb-5 ml-3"}
                    >
                        {itineraryItemsOrder.map((item, index) => (
                            <div key={item._id} className="mb-5 ms-8">
                                <p className="absolute flex items-center justify-center w-8 h-8 bg-foreground rounded-full -start-4 text-background">
                                    {index+1}
                                </p>
                                <div className="w-full">
                                    <div className='flex gap-2 justify-between items-start'>
                                        <p className='text-lg font-bold'>{item.title}</p>
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
                                                    <DropdownMenuItem onClick={() => { setSelectedItineraryItem(item); setIsEditItineraryItemOpen(true) }}>Edit</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className='text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer'
                                                        onClick={() => { setSelectedItineraryItem(item); setIsDeleteItineraryItemDialogOpen(true) }}
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                    <p className='text-sm text-muted-foreground'>{item.subTitle}</p>
                                    <p className='text-base text-foreground mt-2'>
                                        {item.shortDesc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </ReactSortable >
                        : <p className='mb-5 text-base text-muted-foreground'>No itinerary items found. Please add one.</p>
                    }
                    <Button onClick={() => setIsAddItineraryItemOpen(true)} variant='default' className='w-full'><PlusCircle className="w-5 h-5 mr-2" />Add new</Button>
                </CardContent>
            </Card>
            <AddItineraryItem open={isAddItineraryItemOpen} setOpen={setIsAddItineraryItemOpen} tour={tour} />
            {selectedItineraryItem && <EditItineraryItem open={isEditItineraryItemOpen} setOpen={setIsEditItineraryItemOpen} tour={tour} itineraryItem={selectedItineraryItem} />}
            {selectedItineraryItem && <DeleteItineraryItemDialog open={isDeleteItineraryItemDialogOpen} setOpen={setIsDeleteItineraryItemDialogOpen} tour={tour} itineraryItem={selectedItineraryItem} />}
        </>
    )
}

export default TourItineraryItems