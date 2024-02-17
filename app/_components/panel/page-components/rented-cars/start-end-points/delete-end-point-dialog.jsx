import React from 'react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog"
import { Button } from '@/app/_components/ui/button'
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Message from '@/app/_components/ui/message';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/app/_components/ui/use-toast';
import { useRouter } from 'next/navigation';

const DeleteEndPointDialog = ({ open, setOpen, rentedCar, endPoint, callback }) => {
  const queryClient = useQueryClient()
  const router = useRouter();
  const { toast } = useToast()
  // End point delete
  const { mutate: deleteEndPoint, isPending: isDeleteEndPointPending, error: deleteEndPointError } = useMutation({
    mutationFn: async (endPoint) => {
      try {
        const { data } = await axios.delete(`/api/panel/rented-cars/${rentedCar._id}/end-points/${endPoint._id}`)
        return data;
      } catch (error) {
        throw new Error(error.response.data.error)
      }
    },
    onSuccess: (data, variables) => {
      toast({ description: `${endPoint.address} has been deleted successfully.` })
      queryClient.invalidateQueries({
        queryKey: ['rented-cars', rentedCar._id]
      })
      if (callback) {
        router.push(callback)
      }
      setOpen(false);
    }
  })
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className='w-[95%]'>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete <span className='text-foreground'>{endPoint.address}</span>.
          </AlertDialogDescription>
          <Message variant={deleteEndPointError?.message ? 'destructive' : 'default'} message={deleteEndPointError?.message} />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant='destructive' onClick={() => deleteEndPoint(endPoint)} disabled={isDeleteEndPointPending}>
            {isDeleteEndPointPending ?
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
              : 'Delete end point'
            }
          </Button>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteEndPointDialog