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
import { Switch } from '@/app/_components/ui/switch'
import { Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Message from '@/app/_components/ui/message';
import ImageInput from '@/app/_components/ui/image-input';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    image: z.unknown().refine(value => (value || Array.isArray(value) || value.length > 0), { message: 'Category image is required' }),
    isPinOnNavbar: z.boolean().optional(),
    isPinOnFilters: z.boolean().optional(),
});

const AddTourCategory = ({ open, setOpen, side }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            image: '',
            isPinOnNavbar: false,
            isPinOnFilters: false,
        }
    });
    // Tour category add function
    const { mutate: addTourCategory, isPending: isAddTourCategoryPending, isSuccess: isAddTourCategorySuccess, error: addTourCategoryError } = useMutation({
        mutationFn: async (formData) => {
            try {
                const bodyFormData = new FormData()
                for (var key in formData) {
                    bodyFormData.append(key, formData[key]);
                }
                const { data } = await axios.post(`/api/panel/tour-categories/`, bodyFormData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tour-categories'],
            })
            form.reset()
        },
    })
    return (
        <Sheet open={open} onOpenChange={setOpen} className='w-full'>
            <SheetContent side={side} className='overflow-auto'>
                <SheetHeader className='text-left'>
                    <SheetTitle>Add tour category</SheetTitle>
                    <SheetDescription>
                        Add tour categories to categorize tours in multiple categories.
                    </SheetDescription>
                    <Message variant={addTourCategoryError?.message ? 'destructive' : 'default'} message={addTourCategoryError?.message || isAddTourCategorySuccess && `Category has been added successfully.`} />
                </SheetHeader>
                <div className="mt-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(addTourCategory)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name='image'
                                render={({ field }) => (
                                    <FormItem className="bg-background flex flex-col xs:flex-row gap-x-5 gap-y-3 items-start justify-between rounded-lg border p-4 space-y-0">
                                        <div className="flex flex-col gap-1">
                                            <FormLabel className="text-base">
                                                Category image
                                            </FormLabel>
                                            <FormDescription>
                                                This image will be used as category image on the website.
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
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="One day tours" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='isPinOnNavbar'
                                render={({ field }) => (
                                    <FormItem className="bg-background flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 gap-3">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Pin on navbar
                                            </FormLabel>
                                            <FormDescription>
                                                Pining a category on navbar will show this category on navbar.
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
                                                Pining a category on filters will show this category filter on tours page.
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
                            <Button type="submit" className='w-full' disabled={isAddTourCategoryPending}>
                                {isAddTourCategoryPending ?
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                    : 'Add tour category'
                                }
                            </Button>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default AddTourCategory