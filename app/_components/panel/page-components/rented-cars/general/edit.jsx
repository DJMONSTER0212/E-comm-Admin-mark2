import React, { useEffect } from 'react'
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
import { Loader2, ChevronsUpDown, Check, PlusCircle } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Message from '@/app/_components/ui/message';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
  CommandList
} from "@/app/_components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import { cn } from '@/app/_lib/utils';
import { Textarea } from "@/app/_components/ui/textarea"
import { Badge } from '@/app/_components/ui/badge';
import { carPromotionTags } from '@/app/_conf/constants/constant';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
  price: z.coerce.number().min(1, { message: 'Price is required' }),
  shortDesc: z.string().optional(),
  desc: z.string().optional(),
  cityId: z.string().min(1, { message: 'City is required' }),
  tags: z.array(z.enum(carPromotionTags.map((tag) => tag.value))),
  isActive: z.boolean().optional(),
});
const EditRentedCar = ({ rentedCar }) => {
  const queryClient = useQueryClient();
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
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: rentedCar.price || 100,
      shortDesc: rentedCar.shortDesc || '',
      desc: rentedCar.desc || '',
      cityId: rentedCar.cityId || '',
      tags: rentedCar.tags || [],
      isActive: rentedCar.isActive || false,
    }
  });
  // Rented car details update function
  const { mutate: updateRentedCar, isPending: isUpdateRentedCarPending, isSuccess: isUpdateRentedCarSuccess, error: updateRentedCarError } = useMutation({
    mutationFn: async (formData) => {
      try {
        const bodyFormData = new FormData()
        // Sending tags by stringify them
        formData.tags = JSON.stringify(formData.tags)
        for (var key in formData) {
          bodyFormData.append(key, formData[key]);
        }
        const { data } = await axios.put(`/api/panel/rented-cars/${rentedCar._id}`, bodyFormData)
        return data;
      } catch (error) {
        throw new Error(error.response.data.error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['rented-cars'],
      })
    },
  })
  // Update default values on change in smtp details
  useEffect(() => {
    if (rentedCar) {
      Object.entries(rentedCar).forEach(([name, value]) => form.setValue(name, value));
    }
  }, [rentedCar, form])
  return (
    <Card className='lg:col-span-2 h-fit'>
      <CardHeader>
        <CardTitle size='lg'>Rented car details</CardTitle>
        <CardDescription>Edit rented car details of <span className='text-foreground font-medium'>{rentedCar.name} {rentedCar.nickname && `(${rentedCar.nickname})`}</span> car.</CardDescription>
        <Message className='mb-4' variant={updateRentedCarError?.message ? 'destructive' : 'default'} message={updateRentedCarError?.message || isUpdateRentedCarSuccess && `Rented car details has been updated successfully.`} />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(updateRentedCar)} className="space-y-3">
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
              name="shortDesc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write short description here..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    It will be visible on top after the title.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write description here..."
                      className="resize-none"
                      rows={7}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    It will be visible as the main description or about rented cars section.
                  </FormDescription>
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
                                    carPromotionTags.filter((tag) => field.value.includes(tag.value))
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
                            {carPromotionTags.map((tag) => {
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
                    Tags are used to show rented cars in some section on homepage like new rented cars, popular rented cars, etc.
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
                      Activate a rented car will list this on website and allow bookings.
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
            <Button type="submit" className='w-full' disabled={isUpdateRentedCarPending}>
              {isUpdateRentedCarPending ?
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>
                : 'Update details'
              }
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default EditRentedCar