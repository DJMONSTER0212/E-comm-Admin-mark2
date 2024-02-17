import React, { useEffect } from 'react'
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
import { Switch } from '@/app/_components/ui/switch'
import { Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Message from '@/app/_components/ui/message';
import ImageInput from '@/app/_components/ui/image-input';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    image: z.unknown().optional(),
    name: z.string().optional(),
    isPinOnFilters: z.boolean().optional(),
})

const EditCarCompany = ({ open, setOpen, carCompany, side }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            image: carCompany.image || '',
            name: carCompany.name,
            isPinOnFilters: carCompany.isPinOnFilters || false,
        }
    });
    // Car company update function
    const { mutate: updateCarCompany, isPending: isUpdateCarCompanyPending, isSuccess: isUpdateCarCompanySuccess, error: updateCarCompanyError, reset: updateCarCompanyReset } = useMutation({
        mutationFn: async (formData) => {
            try {
                const bodyFormData = new FormData()
                for (var key in formData) {
                    bodyFormData.append(key, formData[key]);
                }
                const { data } = await axios.put(`/api/panel/car-companies/${carCompany._id}`, bodyFormData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['car-companies'],
            })
        },
    })
    // Update default values on change in car company values
    useEffect(() => {
        if (carCompany) {
            const updateValues = {
                image: carCompany.image || '',
                name: carCompany.name,
                isPinOnFilters: carCompany.isPinOnFilters || false,
            }
            Object.entries(updateValues).forEach(([name, value]) => form.setValue(name, value));
            updateCarCompanyReset()
        }
    }, [carCompany, form, updateCarCompanyReset])
    return (
        <Sheet open={open} onOpenChange={setOpen} className='w-full'>
            <SheetContent side={side} className='overflow-auto'>
                <SheetHeader className='text-left'>
                    <SheetTitle>Update car company</SheetTitle>
                    <SheetDescription>
                        Car companies are used to add cars and list cars for that company.
                    </SheetDescription>
                    <Message variant={updateCarCompanyError?.message ? 'destructive' : 'default'} message={updateCarCompanyError?.message || isUpdateCarCompanySuccess && `Car company has been updated successfully.`} />
                </SheetHeader>
                <div className="mt-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(updateCarCompany)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name='image'
                                render={({ field }) => (
                                    <FormItem className="bg-background flex flex-col xs:flex-row gap-x-5 gap-y-3 items-start justify-between rounded-lg border p-4 space-y-0">
                                        <div className="flex flex-col gap-1">
                                            <FormLabel className="text-base">
                                                Company image (Optional)
                                            </FormLabel>
                                            <FormDescription>
                                                This image will be used as company image on the website.
                                            </FormDescription>
                                            <FormMessage />
                                        </div>
                                        <FormControl>
                                            <ImageInput field={field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Tata" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='isPinOnFilters'
                                render={({ field }) => (
                                    <FormItem className="bg-background flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 gap-3">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Pin on filter
                                            </FormLabel>
                                            <FormDescription>
                                                Pining a company on filters will show this company filter on rented cars page.
                                            </FormDescription>
                                            <FormMessage />
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className='w-full' disabled={isUpdateCarCompanyPending}>
                                {isUpdateCarCompanyPending ?
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                    : 'Update details'
                                }
                            </Button>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default EditCarCompany