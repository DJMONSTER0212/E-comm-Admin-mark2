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
import { Loader2, ChevronDown, Check, PlusCircle } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Message from '@/app/_components/ui/message';
import ImageInput from '@/app/_components/ui/image-input';
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
import { tourPromotionTags } from '@/app/_conf/constants/constant';

// ZOD Validation >>>>>>>>>>
const formSchema = z.object({
  images: z.any().array().min(1, { message: 'At least one image is required' }),
  name: z.string().min(1, { message: 'Tour name is required' }),
  duration: z.coerce.number().optional(),
  languages: z.string().optional(),
  shortDesc: z.string().optional(),
  desc: z.string().optional(),
  cityId: z.string().min(1, { message: 'City is required' }),
  tourCategoryId: z.string().min(1, { message: 'Tour category is required' }),
  tags: z.array(z.enum(tourPromotionTags.map((tag) => tag.value))),
  isPinOnNavbar: z.boolean().optional(),
  isActive: z.boolean().optional(),
});
const EditTour = ({ tour }) => {
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
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      images: tour.images || [],
      name: tour.name || '',
      duration: tour.duration || '',
      languages: tour.languages || '',
      shortDesc: tour.shortDesc || '',
      desc: tour.desc || '',
      cityId: tour.cityId || '',
      tourCategoryId: tour.tourCategoryId || '',
      tags: tour.tags || [],
      isPinOnNavbar: tour.isPinOnNavbar || false,
      isActive: tour.isActive || false,
    }
  });
  // Tour details update function
  const { mutate: updateTour, isPending: isUpdateTourPending, isSuccess: isUpdateTourSuccess, error: updateTourError } = useMutation({
    mutationFn: async (formData) => {
      try {
        const bodyFormData = new FormData()
        // Adding image files to formdata
        formData.images.map((image, index) => {
          typeof image != 'string' && bodyFormData.append(`images[${index}]`, image)
        })
        // Sending stringify images array to determine total images by parsing
        formData.images = JSON.stringify(formData.images)
        // Sending tags by stringify them
        formData.tags = JSON.stringify(formData.tags)
        for (var key in formData) {
          bodyFormData.append(key, formData[key]);
        }
        const { data } = await axios.put(`/api/panel/tours/${tour._id}`, bodyFormData)
        return data;
      } catch (error) {
        throw new Error(error.response.data.error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tours'],
      })
    },
  })
  // Update default values on change in tour details
  useEffect(() => {
    if (tour) {
      Object.entries(tour).forEach(([name, value]) => form.setValue(name, value));
    }
  }, [tour, form])
  return (
    <Card className='lg:col-span-2'>
      <CardHeader>
        <CardTitle size='lg'>Tour details</CardTitle>
        <CardDescription>Edit tour details of <span className='text-foreground font-medium'>{tour.name}</span> tour.</CardDescription>
        <Message className='mb-4' variant={updateTourError?.message ? 'destructive' : 'default'} message={updateTourError?.message || isUpdateTourSuccess && `Tour details has been updated successfully.`} />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(updateTour)} className="space-y-3">
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
                      imageGridClassName={'grid-col-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2'}
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
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (In hours)</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder="24" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Languages</FormLabel>
                  <FormControl>
                    <Input placeholder="Hindi, English and Rajasthani" {...field} />
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
                    It will be visible as the main description or about tours section.
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
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {isTourCategoriesPending && "Loading tour categories..."}
                          {isTourCategoriesSuccess && field.value
                            ? tourCategories.find(
                              (tourCategory) => tourCategory._id === field.value
                            )?.name
                            : "Select category"}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align='start' className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search tour category..."
                          className="h-9"
                        />
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                          {isTourCategoriesPending &&
                            <CommandItem disabled>Loading tour categories...</CommandItem>
                          }
                          {isTourCategoriesSuccess && tourCategories.map((tourCategory) => (
                            <CommandItem
                              value={tourCategory._id}
                              key={tourCategory._id}
                              onSelect={() => {
                                form.setValue("tourCategoryId", tourCategory._id)
                                form.clearErrors("tourCategoryId")
                              }}
                            >
                              {tourCategory.name}
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  tourCategory._id === field.value
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
                                    tourPromotionTags.filter((tag) => field.value.includes(tag.value))
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
                            {tourPromotionTags.map((tag) => {
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
                    Tags are used to show tours in some section on homepage like new tours, popular tours, etc.
                  </FormDescription>
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
                      Pining a tour on navbar will show this tour on navbar in it{"'"}s pinned tour category.
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
              name='isActive'
              render={({ field }) => (
                <FormItem className="bg-background flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 gap-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Activate
                    </FormLabel>
                    <FormDescription>
                      Activating a tour will list this on website and allow bookings.
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
            <Button type="submit" className='w-full' disabled={isUpdateTourPending}>
              {isUpdateTourPending ?
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

export default EditTour