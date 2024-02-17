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
import { Loader2 } from 'lucide-react';
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
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/app/_lib/utils';
import AddCity from '../locations/cities/add';
import { carCategories } from '@/app/_conf/constants/constant';
import AddCarCompany from '../car-companies/add';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    name: z.string().min(1, { message: 'Car name is required' }),
    nickname: z.string().optional(),
    price: z.coerce.number().min(1, { message: 'Price is required' }),
    cityId: z.string().min(1, { message: 'City is required' }),
    carCompanyId: z.string().min(1, { message: 'Company is required' }),
    carCategory: z.enum(carCategories.map((carCategory) => carCategory.value), { required_error: 'Car category is required' }),
    images: z.any().array().min(1, { message: 'At least one image is required' }),
});

const AddRentedCar = ({ open, setOpen }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            images: [],
            name: '',
            nickname: '',
            price: '',
            carCategory: '',
            cityId: '',
            carCompanyId: '',
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
    // Rented car add function
    const { mutate: addRentedCar, isPending: isAddRentedCarPending, isSuccess: isAddRentedCarSuccess, error: addRentedCarError } = useMutation({
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
                const { data } = await axios.post(`/api/panel/rented-cars/`, bodyFormData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['rented-cars'],
            })
            form.reset()
        },
    })
    // State for add city & car company
    const [isAddCityOpen, setIsAddCityOpen] = useState(false)
    const [isAddCarCompanyOpen, setIsAddCarCompanyOpen] = useState(false)
    return (
        <>
            <Sheet open={open} onOpenChange={setOpen} className='w-full'>
                <SheetContent className='overflow-auto'>
                    <SheetHeader className='text-left'>
                        <SheetTitle>Add rented car</SheetTitle>
                        <SheetDescription>
                            Add rented car to recieve new bookings.
                        </SheetDescription>
                        <Message variant={addRentedCarError?.message ? 'destructive' : 'default'} message={addRentedCarError?.message || isAddRentedCarSuccess && `Rented car has been added successfully.`} />
                    </SheetHeader>
                    <div className="mt-5">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(addRentedCar)} className="space-y-3">
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
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price per day</FormLabel>
                                            <FormControl>
                                                <Input type='number' placeholder="899" {...field} />
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
                                                                "w-full justify-between",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {isCitiesPending && "Loading cities..."}
                                                            {isCitiesSuccess && field.value
                                                                ? cities.find(
                                                                    (city) => city._id === field.value
                                                                )?.name
                                                                : "Select city"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                                <Button type="submit" className='w-full' disabled={isAddRentedCarPending}>
                                    {isAddRentedCarPending ?
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                        : 'Add rented car'
                                    }
                                </Button>
                            </form>
                        </Form>
                    </div>
                </SheetContent>
            </Sheet>
            <AddCity open={isAddCityOpen} setOpen={setIsAddCityOpen} />
            <AddCarCompany open={isAddCarCompanyOpen} setOpen={setIsAddCarCompanyOpen} />
        </>
    )
}

export default AddRentedCar