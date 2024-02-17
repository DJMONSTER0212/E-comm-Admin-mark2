import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/app/_components/ui/sheet"
import { Button } from '@/app/_components/ui/button'
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Message from '@/app/_components/ui/message';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
  address: z.string().min(1, { message: 'Address is required' }),
  mapsLink: z.string().optional(),
});

const AddStartPoint = ({ open, setOpen, rentedCar, side }) => {
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      mapsLink: '',
    }
  });
  // Rented car start point add function
  const { mutate: addStartPoint, isPending: isAddStartPointPending, isSuccess: isAddStartPointSuccess, error: addStartPointError } = useMutation({
    mutationFn: async (formData) => {
      try {
        const { data } = await axios.post(`/api/panel/rented-cars/${rentedCar._id}/start-points/`, formData)
        return data;
      } catch (error) {
        throw new Error(error.response.data.error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['rented-cars', rentedCar._id],
      })
      form.reset()
    },
  })
  return (
    <Sheet open={open} onOpenChange={setOpen} className='w-full'>
      <SheetContent side={side} className='overflow-auto'>
        <SheetHeader className='text-left'>
          <SheetTitle>Add start (Pickup) points</SheetTitle>
          <SheetDescription>
            Start-end points are the locations of rented car{"'"}s starting and ending points (Pickup and Drop points).
          </SheetDescription>
          <Message variant={addStartPointError?.message ? 'destructive' : 'default'} message={addStartPointError?.message || isAddStartPointSuccess && `Start point has been added successfully.`} />
        </SheetHeader>
        <div className="mt-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(addStartPoint)} className="space-y-3">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Hawa mahal, Jaipur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mapsLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google maps link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://maps.google.com/...." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className='w-full' disabled={isAddStartPointPending}>
                {isAddStartPointPending ?
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                  : 'Add start point'
                }
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default AddStartPoint