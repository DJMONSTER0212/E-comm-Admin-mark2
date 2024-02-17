import React, { useEffect } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/app/_components/ui/sheet"
import { Button } from '@/app/_components/ui/button'
import axios from "axios";
import Message from '@/app/_components/ui/message';
import { Loader2, ChevronsUpDown, Check } from 'lucide-react';
import { Input } from "@/app/_components/ui/input";
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/app/_components/ui/form";
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
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
import ImageInput from '@/app/_components/ui/image-input';
import { carCategories } from '@/app/_conf/constants/constant';
import { cn } from '@/app/_lib/utils';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    images: z.any().array().min(1, { message: 'At least one image is required' }),
    name: z.string().min(1, { message: 'Car name is required' }),
    nickname: z.string().optional(),
    number: z.string().optional(),
    modelYear: z.string().optional(),
    fuelType: z.string().optional(),
    carCompanyId: z.string().min(1, { message: 'Company is required' }),
    carCategory: z.enum(carCategories.map((carCategory) => carCategory.value), { required_error: 'Car category is required' }),
});

const EditCarDetails = ({ open, setOpen, rentedCar }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            images: rentedCar.images || [],
            name: rentedCar.name || '',
            nickname: rentedCar.nickname || '',
            number: rentedCar.number || '',
            modelYear: rentedCar.modelYear || '',
            fuelType: rentedCar.fuelType || '',
            carCategory: rentedCar.carCategory || '',
            carCompanyId: rentedCar.carCompanyId || '',
        }
    });
    // Fetch car companies
    const { data: carCompanies, isPending: isCarCompaniesPending, isSuccess: isCarCompaniesSuccess } = useQuery({
        queryKey: ['car-companies'],
        queryFn: async () => {
            try {
                const { data } = await axios.get('/api/panel/car-companies?all=true',)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        placeholderData: []
    })
    // Car details update function
    const { mutate: updateCarDetails, isPending: isUpdateCarDetailsPending, isSuccess: isUpdateCarDetailsSuccess, error: updateCarDetailsError } = useMutation({
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
                const { data } = await axios.put(`/api/panel/rented-cars/${rentedCar._id}/car-details`, bodyFormData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['rented-cars', rentedCar._id],
            })
        },
    })
    // Update default values on change in car details
    useEffect(() => {
        if (rentedCar) {
            const updateValues = {
                images: rentedCar.images || [],
                name: rentedCar.name || '',
                nickname: rentedCar.nickname || '',
                number: rentedCar.number || '',
                modelYear: rentedCar.modelYear || '',
                fuelType: rentedCar.fuelType || '',
                carCategory: rentedCar.carCategory || '',
                carCompanyId: rentedCar.carCompanyId || '',
            }
            Object.entries(updateValues).forEach(([name, value]) => form.setValue(name, value));
        }
    }, [rentedCar, form])
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className='overflow-auto'>
                <SheetHeader>
                    <SheetTitle>Update car details</SheetTitle>
                    <SheetDescription>
                        Cars can be given on rent to visitors to a city.
                    </SheetDescription>
                    <Message variant={updateCarDetailsError?.message ? 'destructive' : 'default'} message={updateCarDetailsError?.message || isUpdateCarDetailsSuccess && `Car details has been added successfully.`} />
                </SheetHeader>
                <div className="mt-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(updateCarDetails)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name='images'
                                render={({ field }) => (
                                    <FormItem className="bg-background gap-y-3 items-start justify-between rounded-lg border p-4 space-y-3">
                                        <div className="flex flex-col gap-1">
                                            <FormLabel className="text-base">
                                                Car images
                                            </FormLabel>
                                            <FormDescription>
                                                These images will be visible on car page.
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
                                            <Input placeholder="Alto" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="nickname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nickname (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Rohit's car" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Car number (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="RJ 14 AZ 0123" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="modelYear"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Model year (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="2022" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fuelType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fuel type (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Petrol" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="carCompanyId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Car company</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-full justify-between",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {isCarCompaniesPending && "Loading car companies..."}
                                                        {isCarCompaniesSuccess && field.value
                                                            ? carCompanies.find(
                                                                (carCompany) => carCompany._id === field.value
                                                            )?.name
                                                            : "Select car company"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent align='start' className="w-full p-0">
                                                <Command>
                                                    <CommandInput
                                                        placeholder="Search car company..."
                                                        className="h-9"
                                                    />
                                                    <CommandEmpty>No car company found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {isCarCompaniesPending &&
                                                            <CommandItem disabled>Loading car companies...</CommandItem>
                                                        }
                                                        {isCarCompaniesSuccess && carCompanies.map((carCompany) => (
                                                            <CommandItem
                                                                value={carCompany._id}
                                                                key={carCompany._id}
                                                                onSelect={() => {
                                                                    form.setValue("carCompanyId", carCompany._id);
                                                                    form.clearErrors("carCompanyId");
                                                                }}
                                                            >
                                                                {carCompany.name}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto h-4 w-4",
                                                                        carCompany._id === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                        <CommandSeparator className='my-1' />
                                                        <CommandItem onSelect={() => { setIsAddCarCompanyOpen(true) }} className='bg-primary aria-selected:bg-primary text-primary-foreground aria-selected:text-primary-foreground justify-center'>Add car company</CommandItem>
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
                                name="carCategory"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Car category</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-full justify-between",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? carCategories.find(
                                                                (carCategory) => carCategory.value === field.value
                                                            )?.label
                                                            : "Select car category"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                                                        {carCategories.map((carCategory) => (
                                                            <CommandItem
                                                                value={carCategory.value}
                                                                key={carCategory.value}
                                                                onSelect={() => {
                                                                    form.setValue("carCategory", carCategory.value)
                                                                    form.clearErrors("carCategory")
                                                                }}
                                                            >
                                                                {carCategory.label}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto h-4 w-4",
                                                                        carCategory.value === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isUpdateCarDetailsPending} className='w-full'>
                                {isUpdateCarDetailsPending ?
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

export default EditCarDetails