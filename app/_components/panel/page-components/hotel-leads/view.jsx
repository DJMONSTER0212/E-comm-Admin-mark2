import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/app/_components/ui/sheet"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Label } from '@/app/_components/ui/label';
import { Calendar, Loader2, Mail, MapPin, Phone } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/_components/ui/select"
import { leadStatuses } from '@/app/_conf/constants/constant';
import { useToast } from "@/app/_components/ui/use-toast";
import moment from 'moment';

const ViewHotelLead = ({ open, setOpen, hotelLead, side }) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    // Hotel lead mutate actions
    const { mutate: mutateHotelLead, isPending: isMutateHotelLeadPending, } = useMutation({
        mutationFn: async ({ status }) => {
            try {
                const { data } = await axios.patch(`/api/panel/hotel-leads/${hotelLead._id}`, { status })
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['hotel-leads'],
            })
            toast({ description: `Lead status has been update successfully.` });
        },
        onError: (error) => {
            toast({ description: error?.message, variant: 'destructive' })
        }
    })
    return (
        <Sheet open={open} onOpenChange={setOpen} className='w-full'>
            <SheetContent side={side} className='overflow-auto'>
                <SheetHeader className='text-left'>
                    <SheetTitle>Hotel lead</SheetTitle>
                    <SheetDescription>
                        Hotel leads are received from the website{"'"}s hotel application form.
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-5 grid grid-cols-1 gap-5">
                    <div className="flex flex-col gap-2.5">
                        <Label>Name</Label>
                        <p className='text-sm text-muted-foreground'>{hotelLead.name}</p>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <Label>Guests</Label>
                        <p className='text-sm text-muted-foreground'>{hotelLead.guests}</p>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <Label>Contact information</Label>
                        <div className="grid grid-cols-1 gap-1.5 text-muted-foreground">
                            <div className="flex gap-3 items-center">
                                <Mail className='w-4 h-4' />
                                <p className='text-sm'>{hotelLead.email || <span className='text-xs'>Not available</span>}</p>
                            </div>
                            <div className="flex gap-3 items-center">
                                <Phone className='w-4 h-4' />
                                <p className='text-sm'>{hotelLead.phone || <span className='text-xs'>Not available</span>}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <Label>Wants hotel</Label>
                        <div className="grid grid-cols-1 gap-1.5 text-muted-foreground">
                            <div className="flex gap-3 items-center">
                                <MapPin className='w-4 h-4' />
                                <p className='text-sm'>{hotelLead.city + ', ' + hotelLead.country || <span className='text-xs text-muted-foreground'>Not available</span>}</p>
                            </div>
                            <div className="flex gap-3 items-center">
                                <Calendar className='w-4 h-4' />
                                <p className='text-sm'>{moment(hotelLead.checkIn).format('DD MMM YYYY') + ' to ' + moment(hotelLead.checkOut).format('DD MMM YYYY') || <span className='text-xs text-muted-foreground'>Not available</span>}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <Label>Message</Label>
                        <p className='text-sm text-muted-foreground'>{hotelLead.message || <span className='text-xs'>Not available</span>}</p>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <Label>Date</Label>
                        <p className='text-sm text-muted-foreground'>{moment(hotelLead.createdAt).format('DD MMM YYYY') || <span className='text-xs'>Not available</span>}</p>
                    </div>
                    <div className="flex items-center justify-between gap-2 border p-2 rounded-md">
                        <Label className='pl-2 border-l border-x-2 border-foreground border-r-0'>Update status</Label>
                        <Select onValueChange={(value) => { mutateHotelLead({ status: value }); }} defaultValue={hotelLead.status}>
                            <SelectTrigger className='h-7 w-fit max-w-[350px]'>
                                <SelectValue placeholder="Select a role" />
                                {isMutateHotelLeadPending && <Loader2 className='animate-spin w-3 h-3 text-foreground ml-2' />}
                            </SelectTrigger>
                            <SelectContent>
                                {leadStatuses.map((status) => (
                                    <SelectItem key={status.value} value={status.value}>
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default ViewHotelLead