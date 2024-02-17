import React, { useState, useEffect } from 'react'
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
import { useForm, useWatch } from 'react-hook-form';
import { Switch } from '@/app/_components/ui/switch'
import { Loader2, PlusCircle } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Message from '@/app/_components/ui/message';
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from '@/app/_lib/utils';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandSeparator,
    CommandList
} from "@/app/_components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/app/_components/ui/popover"
import AddState from '../states/add';
import AddCountry from '../countries/add';
import ImageInput from '@/app/_components/ui/image-input';
import { cityPromotionTags } from '@/app/_conf/constants/constant';
import { Badge } from '@/app/_components/ui/badge';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    name: z.string().min(1, { message: 'City name is required' }),
    stateId: z.string().min(1, { message: 'State is required' }),
    image: z.unknown().refine(value => (value || Array.isArray(value) || value.length > 0), { message: 'City image is required' }),
    tags: z.array(z.enum(cityPromotionTags.map((tag) => tag.value))),
    isActive: z.boolean().optional(),
});

const AddCity = ({ open, setOpen, stateId, countryId, side }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            stateId: stateId || '',
            image: '',
            tags: [],
            isActive: false,
        }
    });
    const selectedCountry = useWatch({ control: form.control, name: 'countryId', defaultValue: countryId })
    // Fetch countries
    const { data: countries, error: countriesError, isPending: isCountriesPending, isSuccess: isCountriesSuccess } = useQuery({
        queryKey: ['countries'],
        queryFn: async () => {
            try {
                const { data } = await axios.get('/api/panel/countries/',)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        placeholderData: []
    })
    // Fetch states
    const { data: states, error: statesError, isPending: isStatesPending, isSuccess: isStatesSuccess } = useQuery({
        queryKey: ['states', selectedCountry],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/panel/states?countryId=${selectedCountry}`,)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        enabled: selectedCountry ? true : false,
        placeholderData: []
    })
    // City add function
    const { mutate: addCity, isPending: isAddCityPending, isSuccess: isAddCitySuccess, error: addCityError } = useMutation({
        mutationFn: async (formData) => {
            try {
                const bodyFormData = new FormData()
                // Sending tags by stringify them
                formData.tags = JSON.stringify(formData.tags)
                for (var key in formData) {
                    bodyFormData.append(key, formData[key]);
                }
                const { data } = await axios.post(`/api/panel/cities/`, bodyFormData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['cities', stateId],
            })
            form.reset()
        },
    })
    // Update default values on change in stateId or countryId values
    useEffect(() => {
        if (countryId) {
            form.setValue('countryId', countryId)
        }
        if (stateId) {
            form.setValue('stateId', stateId)
        }
    }, [countryId, stateId, form])
    // Open state for add state and country
    const [isAddStateOpen, setIsAddStateOpen] = useState(false)
    const [isAddCountryOpen, setIsAddCountryOpen] = useState(false)
    return (
        <>
            <Sheet open={open} onOpenChange={setOpen} className='w-full'>
                <SheetContent side={side} className='overflow-auto'>
                    <SheetHeader className='text-left'>
                        <SheetTitle>Add city</SheetTitle>
                        <SheetDescription>
                            Add city to manage tours.
                        </SheetDescription>
                        <Message variant={addCityError?.message ? 'destructive' : 'default'} message={addCityError?.message || isAddCitySuccess && `City has been added successfully.`} />
                    </SheetHeader>
                    <div className="mt-5">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(addCity)} className="space-y-3">
                                <FormField
                                    control={form.control}
                                    name='image'
                                    render={({ field }) => (
                                        <FormItem className="bg-background flex flex-col xs:flex-row gap-x-5 gap-y-3 items-start justify-between rounded-lg border p-4 space-y-0">
                                            <div className="flex flex-col gap-1">
                                                <FormLabel className="text-base">
                                                    City image
                                                </FormLabel>
                                                <FormDescription>
                                                    This image will be used as city image on the website.
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
                                            <FormLabel>City name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Jaipur" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {!(countryId || stateId) &&
                                    <FormField
                                        control={form.control}
                                        name="countryId"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Country</FormLabel>
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
                                                                {isCountriesPending && "Loading countries..."}
                                                                {isCountriesSuccess && field.value
                                                                    ? countries.find(
                                                                        (country) => country._id === field.value
                                                                    )?.name
                                                                    : "Select country"}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent align='start' className="w-full p-0">
                                                        <Command>
                                                            <CommandInput
                                                                placeholder="Search country..."
                                                                className="h-9"
                                                            />
                                                            <CommandEmpty>No country found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {isCountriesPending &&
                                                                    <CommandItem disabled>Loading countries...</CommandItem>
                                                                }
                                                                {isCountriesSuccess && countries.map((country) => (
                                                                    <CommandItem
                                                                        value={country._id}
                                                                        key={country._id}
                                                                        onSelect={() => {
                                                                            form.setValue("countryId", country._id);
                                                                            form.clearErrors("countryId");
                                                                        }}
                                                                    >
                                                                        {country.name}
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto h-4 w-4",
                                                                                country._id === field.value
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                            )}
                                                                        />
                                                                    </CommandItem>
                                                                ))}
                                                                <CommandSeparator className='my-1' />
                                                                <CommandItem onSelect={() => { setIsAddCountryOpen(true) }} className='bg-primary aria-selected:bg-primary text-primary-foreground aria-selected:text-primary-foreground justify-center'>Add country</CommandItem>
                                                            </CommandGroup>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                }
                                {!stateId &&
                                    <FormField
                                        control={form.control}
                                        name="stateId"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>State</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl disabled={!(selectedCountry || countryId) && true}>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className={cn(
                                                                    "w-full justify-between",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {isStatesPending && "Loading states..."}
                                                                {isStatesSuccess && field.value
                                                                    ? states.find(
                                                                        (state) => state._id === field.value
                                                                    )?.name
                                                                    : "Select state"}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent align='start' className="w-full p-0">
                                                        <Command>
                                                            <CommandInput
                                                                placeholder="Search state..."
                                                                className="h-9"
                                                            />
                                                            <CommandEmpty>No state found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {isStatesPending &&
                                                                    <CommandItem disabled>Loading states...</CommandItem>
                                                                }
                                                                {isStatesSuccess && states.map((state) => (
                                                                    <CommandItem
                                                                        value={state._id}
                                                                        key={state._id}
                                                                        onSelect={() => {
                                                                            form.setValue("stateId", state._id);
                                                                            form.clearErrors("stateId");
                                                                        }}
                                                                    >
                                                                        {state.name}
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto h-4 w-4",
                                                                                state._id === field.value
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                            )}
                                                                        />
                                                                    </CommandItem>
                                                                ))}
                                                                <CommandSeparator className='my-1' />
                                                                <CommandItem onSelect={() => { setIsAddStateOpen(true) }} className='bg-primary aria-selected:bg-primary text-primary-foreground aria-selected:text-primary-foreground justify-center'>Add state</CommandItem>
                                                            </CommandGroup>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                }
                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem className='relative'>
                                            <FormLabel>Add tags</FormLabel>
                                            <Popover className='w-full'>
                                                <FormControl>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="outline" className="block w-full justify-start cursor-pointer hover:bg-background">
                                                            <div className="flex items-center justify-between gap-3 w-full">
                                                                <div className="flex gap-2 items-center">
                                                                    <PlusCircle className="mr-2 h-4 w-4" /> tags
                                                                </div>
                                                                {field.value?.length > 0 ? (
                                                                    <div className="flex items-center">
                                                                        <Badge
                                                                            variant="secondary"
                                                                            className="rounded-sm px-1 font-normal lg:hidden"
                                                                        >
                                                                            {field.value.length} Selected
                                                                        </Badge>
                                                                        <div className="hidden space-x-1 lg:flex">
                                                                            {field.value.length > 3 ? (
                                                                                <Badge
                                                                                    variant="secondary"
                                                                                    className="rounded-sm px-1 font-normal"
                                                                                >
                                                                                    {field.value.length} selected
                                                                                </Badge>
                                                                            ) : (
                                                                                cityPromotionTags.filter((tag) => field.value.includes(tag.value))
                                                                                    .map((tag) => (
                                                                                        <Badge
                                                                                            variant="secondary"
                                                                                            key={tag.value}
                                                                                            className="rounded-sm px-1 font-normal"
                                                                                        >
                                                                                            {tag.label}
                                                                                        </Badge>
                                                                                    ))
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ) :
                                                                    <p className="text-sm text-muted-foreground font-normal">No tags selected.</p>
                                                                }
                                                            </div>
                                                        </Button>
                                                    </PopoverTrigger>
                                                </FormControl>
                                                <PopoverContent className="w-full p-0" align="start">
                                                    <Command className='w-full'>
                                                        <CommandInput placeholder='Search tages...' />
                                                        <CommandList>
                                                            <CommandEmpty>No results found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {cityPromotionTags.map((tag) => {
                                                                    const isSelected = field.value?.includes(tag.value) || false;
                                                                    return (
                                                                        <CommandItem
                                                                            key={tag.value}
                                                                            onSelect={() => {
                                                                                if (isSelected) {
                                                                                    field.onChange(field.value.filter((value) => value != tag.value));
                                                                                } else {
                                                                                    field.onChange(field.value ? [...field.value, tag.value] : [tag.value]);
                                                                                }
                                                                            }}
                                                                        >
                                                                            <div
                                                                                className={cn(
                                                                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-muted-foreground",
                                                                                    isSelected
                                                                                        ? "bg-foreground text-primary-foreground"
                                                                                        : "opacity-50 [&_svg]:invisible"
                                                                                )}
                                                                            >
                                                                                <Check className={cn("h-4 w-4")} aria-hidden="true" />
                                                                            </div>
                                                                            <span>{tag.label}</span>
                                                                        </CommandItem>
                                                                    );
                                                                })}
                                                            </CommandGroup>
                                                            {field.value?.length > 0 && (
                                                                <>
                                                                    <CommandSeparator />
                                                                    <CommandGroup>
                                                                        <CommandItem
                                                                            onSelect={() => field.onChange([])}
                                                                            className="justify-center text-center"
                                                                        >
                                                                            Remove all
                                                                        </CommandItem>
                                                                    </CommandGroup>
                                                                </>
                                                            )}
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                            <FormDescription>
                                                Tags are used to show cities in some section on homepage like new destinations, popular destinations, etc.
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='isActive'
                                    render={({ field }) => (
                                        <FormItem className="bg-background flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 gap-3">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">
                                                    Activate
                                                </FormLabel>
                                                <FormDescription>
                                                    Activate a city will list all the tours of this city on website.
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
                                <Button type="submit" className='w-full' disabled={isAddCityPending}>
                                    {isAddCityPending ?
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                        : 'Add city'
                                    }
                                </Button>
                            </form>
                        </Form>
                    </div>
                </SheetContent>
            </Sheet>
            <AddCountry open={isAddCountryOpen} setOpen={setIsAddCountryOpen} />
            <AddState countryId={countryId || selectedCountry} open={isAddStateOpen} setOpen={setIsAddStateOpen} />
        </>
    )
}

export default AddCity