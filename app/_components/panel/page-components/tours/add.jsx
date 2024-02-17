import React, { useState } from 'react'
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
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Message from '@/app/_components/ui/message';
import ImageInput from '@/app/_components/ui/image-input';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandSeparator,
} from "@/app/_components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/app/_components/ui/popover";
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/app/_lib/utils';
import AddCity from '../locations/cities/add';
import AddTourCategory from '../tour-categories/add';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    name: z.string().min(1, { message: 'Tour name is required' }),
    cityId: z.string().min(1, { message: 'City is required' }),
    tourCategoryId: z.string().min(1, { message: 'Tour category is required' }),
    images: z.any().array().min(1, { message: 'At least one image is required' }),
});

const AddTour = ({ open, setOpen }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            images: [],
            name: '',
            cityId: '',
            tourCategoryId: '',
        }
    });
    // Fetch cities
    const { data: cities, isPending: isCitiesPending, isSuccess: isCitiesSuccess } = useQuery({
        queryKey: ['cities'],
        queryFn: async () => {
            try {
                const { data } = await axios.get('/api/panel/cities/',)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        placeholderData: []
    })
    // Fetch tour categories
    const { data: tourCategories, isPending: isTourCategoriesPending, isSuccess: isTourCategoriesSuccess } = useQuery({
        queryKey: ['tour-categories'],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/panel/tour-categories?all=true`,)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        placeholderData: []
    })
    // Tour add function
    const { mutate: addTour, isPending: isAddTourPending, isSuccess: isAddTourSuccess, error: addTourError } = useMutation({
        mutationFn: async (formData) => {
            try {
                const bodyFormData = new FormData()
                // Adding image files to formdata
                formData.images.map((image, index) => {
                    typeof image != 'string' && bodyFormData.append(`images[${index}]`, image)
                })
                // Sending images array to determine total images
                formData.images = JSON.stringify(formData.images)
                for (var key in formData) {
                    bodyFormData.append(key, formData[key]);
                }
                const { data } = await axios.post(`/api/panel/tours/`, bodyFormData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tours'],
            })
            form.reset()
        },
    })
    // State for add city & category
    const [isAddCityOpen, setIsAddCityOpen] = useState(false)
    const [isAddTourCategoryOpen, setIsAddTourCategoryOpen] = useState(false)
    return (
        <>
            <Sheet open={open} onOpenChange={setOpen} className='w-full'>
                <SheetContent className='overflow-auto'>
                    <SheetHeader className='text-left'>
                        <SheetTitle>Add tour</SheetTitle>
                        <SheetDescription>
                            Add rours to recieve new bookings.
                        </SheetDescription>
                        <Message variant={addTourError?.message ? 'destructive' : 'default'} message={addTourError?.message || isAddTourSuccess && `Tour has been added successfully.`} />
                    </SheetHeader>
                    <div className="mt-5">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(addTour)} className="space-y-3">
                                <FormField
                                    control={form.control}
                                    name='images'
                                    render={({ field }) => (
                                        <FormItem className="bg-background gap-y-3 items-start justify-between rounded-lg border p-4 space-y-3">
                                            <div className="flex flex-col gap-1">
                                                <FormLabel className="text-base">
                                                    Tour images
                                                </FormLabel>
                                                <FormDescription>
                                                    These images will be visible on tour page.
                                                </FormDescription>
                                                <FormMessage />
                                            </div>
                                            <FormControl>
                                                <ImageInput
                                                    control={form.control}
                                                    sortable={true}
                                                    field={field}
                                                    multiple={true}
                                                    imageGridClassName={'xs:grid xs:grid-cols-1'}
                                                    imageClassName='xs:max-w-full xs:max-h-full'
                                                />
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
                                                <Input placeholder="City tours" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cityId"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>City</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-full justify-between shadow-none",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {isCitiesPending && "Loading cities..."}
                                                            {isCitiesSuccess && field.value
                                                                ? cities.find(
                                                                    (city) => city._id === field.value
                                                                )?.name
                                                                : "Select city"}
                                                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent align='start' className="w-full p-0">
                                                    <Command>
                                                        <CommandInput
                                                            placeholder="Search city..."
                                                            className="h-9"
                                                        />
                                                        <CommandEmpty>No city found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {isCitiesPending &&
                                                                <CommandItem disabled>Loading cities...</CommandItem>
                                                            }
                                                            {isCitiesSuccess && cities.map((city) => (
                                                                <CommandItem
                                                                    value={city._id}
                                                                    key={city._id}
                                                                    onSelect={() => {
                                                                        form.setValue("cityId", city._id);
                                                                        form.clearErrors("cityId");
                                                                    }}
                                                                >
                                                                    {city.name}
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto h-4 w-4",
                                                                            city._id === field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                            <CommandSeparator className='my-1' />
                                                            <CommandItem onSelect={() => { setIsAddCityOpen(true) }} className='bg-primary aria-selected:bg-primary text-primary-foreground aria-selected:text-primary-foreground justify-center'>Add city</CommandItem>
                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="tourCategoryId"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Tour category</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-full justify-between shadow-none",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {isTourCategoriesPending && "Loading tour categories..."}
                                                            {isTourCategoriesSuccess && field.value
                                                                ? tourCategories.find(
                                                                    (category) => category._id === field.value
                                                                )?.name
                                                                : "Select category"}
                                                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent align='start' className="w-full p-0">
                                                    <Command>
                                                        <CommandInput
                                                            placeholder="Search category..."
                                                            className="h-9"
                                                        />
                                                        <CommandEmpty>No category found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {isTourCategoriesPending &&
                                                                <CommandItem disabled>Loading tour categories...</CommandItem>
                                                            }
                                                            {isTourCategoriesSuccess && tourCategories.map((category) => (
                                                                <CommandItem
                                                                    value={category._id}
                                                                    key={category._id}
                                                                    onSelect={() => {
                                                                        form.setValue("tourCategoryId", category._id)
                                                                        form.clearErrors("tourCategoryId")
                                                                    }}
                                                                >
                                                                    {category.name}
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto h-4 w-4",
                                                                            category._id === field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                            <CommandSeparator className='my-1' />
                                                            <CommandItem onSelect={() => { setIsAddTourCategoryOpen(true) }} className='bg-primary aria-selected:bg-primary text-primary-foreground aria-selected:text-primary-foreground justify-center'>Add category</CommandItem>
                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className='w-full' disabled={isAddTourPending}>
                                    {isAddTourPending ?
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                        : 'Add tour'
                                    }
                                </Button>
                            </form>
                        </Form>
                    </div>
                </SheetContent>
            </Sheet>
            <AddCity open={isAddCityOpen} setOpen={setIsAddCityOpen} />
            <AddTourCategory open={isAddTourCategoryOpen} setOpen={setIsAddTourCategoryOpen} />
        </>
    )
}

export default AddTour