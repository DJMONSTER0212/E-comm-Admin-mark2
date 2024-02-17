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

const DeleteStartPointDialog = ({ open, setOpen, rentedCar, startPoint, callback }) => {
  const queryClient = useQueryClient()
  const router = useRouter();
  const { toast } = useToast()
  // Start point delete
  const { mutate: deleteStartPoint, isPending: isDeleteStartPointPending, error: deleteStartPointError } = useMutation({
    mutationFn: async (startPoint) => {
      try {
        const { data } = await axios.delete(`/api/panel/rented-cars/${rentedCar._id}/start-points/${startPoint._id}`)
        return data;
      } catch (error) {
        throw new Error(error.response.data.error)
      }
    },
    onSuccess: (data, variables) => {
      toast({ description: `${startPoint.address} has been deleted successfully.` })
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
            This action cannot be undone. This will permanently delete <span className='text-foreground'>{startPoint.address}</span>.
          </AlertDialogDescription>
          <Message variant={deleteStartPointError?.message ? 'destructive' : 'default'} message={deleteStartPointError?.message} />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant='destructive' onClick={() => deleteStartPoint(startPoint)} disabled={isDeleteStartPointPending}>
            {isDeleteStartPointPending ?
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
              : 'Delete start point'
            }
          </Button>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteStartPointDialog