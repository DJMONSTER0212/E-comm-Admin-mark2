import React, { useState, useEffect } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
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
    CommandSeparator
} from "@/app/_components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/app/_components/ui/popover"
import AddCountry from '../countries/add';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
    name: z.string().min(1, { message: 'State name is required' }),
    countryId: z.string().min(1, { message: 'Country is required' }),
    isActive: z.boolean().optional(),
});

const AddState = ({ open, setOpen, countryId, side }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            countryId: countryId || '',
            isActive: false,
        }
    });
    // Fetch countries
    const { data: countries, error: countriesError, isPending: isCountriesPending, isSuccess: isCountriesSuccess, defaultValues } = useQuery({
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
    // State add function
    const { mutate: addState, isPending: isAddStatePending, isSuccess: isAddStateSuccess, error: addStateError } = useMutation({
        mutationFn: async (formData) => {
            try {
                const { data } = await axios.post(`/api/panel/states/`, formData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['states'],
            })
            form.reset()
        },
    })
    // Update default values on change in countryId values
    useEffect(() => {
        if (countryId) {
            form.setValue('countryId', countryId)
        }
    }, [countryId, form])
    // Open state for add country
    const [isAddCountryOpen, setIsAddCountryOpen] = useState(false)
    return (
        <>
            <Sheet open={open} onOpenChange={setOpen} className='w-full'>
                <SheetContent side={side} className='overflow-auto'>
                    <SheetHeader className='text-left'>
                        <SheetTitle>Add state</SheetTitle>
                        <SheetDescription>
                            States are used to list all the tours for a state.
                        </SheetDescription>
                        <Message variant={addStateError?.message ? 'destructive' : 'default'} message={addStateError?.message || isAddStateSuccess && `State has been added successfully.`} />
                    </SheetHeader>
                    <div className="mt-5">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(addState)} className="space-y-3">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>State name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Goa" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {!countryId &&
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
                                                    Activate a state will list all the tours of this state on website.
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
                                <Button type="submit" className='w-full' disabled={isAddStatePending}>
                                    {isAddStatePending ?
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                                        : 'Add state'
                                    }
                                </Button>
                            </form>
                        </Form>
                    </div>
                </SheetContent>
            </Sheet>
            <AddCountry open={isAddCountryOpen} setOpen={setIsAddCountryOpen} />
        </>
    )
}

export default AddState