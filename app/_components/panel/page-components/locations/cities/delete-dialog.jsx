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

const DeleteCityDialog = ({ open, setOpen, city, stateId, callback }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast()
  // City delete
  const { mutate: deleteCity, isPending: isDeleteCityPending, isSuccess: isDeleteCitySuccess, error: deleteCityError } = useMutation({
    mutationFn: async (city) => {
      try {
        const { data } = await axios.delete(`/api/panel/cities/${city._id}`)
        return data;
      } catch (error) {
        throw new Error(error.response.data.error)
      }
    },
    onSuccess: (data, variables) => {
      toast({ description: `${city.name} has been deleted successfully.` })
      queryClient.invalidateQueries({
        queryKey: ['cities', stateId],
      })
      if (callback) {
        router.push(callback)
      }
      setOpen(false);
    },
    onError: (error) => {
    }
  })
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className='w-[95%]'>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete <span className='text-foreground'>{city.name + "'s"}</span> cities, tours
            and remove all the {city.name} related data from the server.
          </AlertDialogDescription>
          <Message variant={deleteCityError?.message ? 'destructive' : 'default'} message={deleteCityError?.message} />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant='destructive' onClick={() => deleteCity(city)} disabled={isDeleteCityPending}>
            {isDeleteCityPending ?
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
              : 'Delete city'
            }
          </Button>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteCityDialog