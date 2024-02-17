import React, { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card"
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
import { Loader2, ChevronsUpDown, Check, Search, CalendarDays } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Message from '@/app/_components/ui/message';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/_components/ui/select"
import { couponTypes, couponValidOns } from "@/app/_conf/constants/constant";
import { Textarea } from '@/app/_components/ui/textarea';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandSeparator
} from "@/app/_components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/app/_components/ui/popover"
import { cn } from '@/app/_lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar"
import { format } from "date-fns"
import { Calendar } from "@/app/_components/ui/calendar"

// ZOD Validation >>>>>>>>>>
const COMMON_ERROR_CODE = "custom";
const formSchema = z.object({
    coupon: z.string().min(1, { message: 'Coupon code is required' }).min(6, { message: 'Coupon code should have 6 characters' }).max(12, { message: 'Coupon code should have max 12 characters' }),
    shortDesc: z.string().optional(),
    type: z.enum(couponTypes.map(type => type.value), { required_error: 'Coupon type is required' }),
    validOn: z.enum(couponValidOns.map(couponValidOn => couponValidOn.value), { required_error: 'Coupon valid on is required' }),
    userId: z.string().optional(),
    tourId: z.string().optional(),
    rentedCarId: z.string().optional(),
    discountType: z.enum(['flat', 'upto'], { required_error: 'Coupon discount type is required' }),
    priceFormat: z.enum(['percentage', 'raw'], { required_error: 'Coupon price format is required' }),
    price: z.coerce.number().min(1, { message: 'Price is required' }),
    maxPrice: z.coerce.number().optional(),
    maxUsage: z.coerce.number().min(1, { message: 'Coupon max usage is required' }),
    allowMultipleUsage: z.boolean().optional(),
    expirationDate: z.date({ required_error: "Coupon expiry date is required." }),
    isActive: z.boolean().optional(),
    makePublic: z.boolean().optional(),
}).superRefine(({ type, validOn, discountType, priceFormat, price, maxPrice, userId, tourId, rentedCarId }, ctx) => {
    const addCustomIssue = (path, message) => ctx.addIssue({ code: COMMON_ERROR_CODE, message, path });
    if (type === 'userOnly' && !userId) addCustomIssue(['userId'], "User is required for a user only coupon.");
    if (validOn === 'tour' && !tourId) addCustomIssue(['tourId'], "Tour is required for coupon valid only on a tour.");
    if (validOn === 'rentedCar' && !rentedCarId) addCustomIssue(['rentedCarId'], "Rented car is required for coupon valid only on a rented car.");
    if (discountType === 'upto' && priceFormat !== 'percentage') addCustomIssue(['priceFormat'], "Please select percentage price format for an upto discount type coupon.");
    if (priceFormat === 'percentage') {
        if (Number(price) <= 0 || Number(price) > 100) addCustomIssue(['price'], "Price in percentage format should be between 1 to 100.");
    }
});

const EditCoupon = ({ coupon }) => {
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            coupon: coupon.coupon || '',
            shortDesc: coupon.shortDesc || '',
            type: coupon.type || '',
            validOn: coupon.validOn || '',
            userId: coupon.userId || '',
            tourId: coupon.tourId || '',
            rentedCarId: coupon.rentedCarId || '',
            discountType: coupon.discountType || '',
            priceFormat: coupon.priceFormat || '',
            price: coupon.price || '',
            maxPrice: coupon.maxPrice || '',
            maxUsage: coupon.maxUsage || '',
            allowMultipleUsage: coupon.allowMultipleUsage || false,
            expirationDate: new Date(coupon.expirationDate) || new Date(),
            isActive: coupon.isActive || false,
            makePublic: coupon.makePublic || false,
        }
    });
    const couponType = useWatch({ control: form.control, name: 'type' });
    const validOn = useWatch({ control: form.control, name: 'validOn' });
    const discountType = useWatch({ control: form.control, name: 'discountType' });
    const priceFormat = useWatch({ control: form.control, name: 'priceFormat' });
    // Fetch coupons
    const [userInput, setUserInput] = useState(coupon.user?.email || '');
    const [selectedUser, setSelectedUser] = useState(coupon.user && coupon.user);
    const { data: users, isPending: isUsersPending, isSuccess: isUsersSuccess, isLoading: isUsersLoading } = useQuery({
        queryKey: ['usersSearch', userInput],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/panel/users?nameOrEmail=${userInput}&page=1&per_page=50`,)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        placeholderData: []
    })
    // Fetch tours
    const [tourInput, setTourInput] = useState(coupon.tour?.name || '');
    const [selectedTour, setSelectedTour] = useState(coupon.tour && coupon.tour);
    const { data: tours, isPending: isToursPending, isSuccess: isToursSuccess, isLoading: isToursLoading } = useQuery({
        queryKey: ['toursSearch', tourInput],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/panel/tours?name=${tourInput}&page=1&per_page=50`,)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        placeholderData: []
    })
    // Fetch rented cars
    const [rentedCarInput, setRentedCarInput] = useState(coupon.rentedCar?.name || '');
    const [selectedRentedCar, setSelectedRentedCar] = useState(coupon.rentedCar && coupon.rentedCar);
    const { data: rentedCars, isPending: isRentedCarsPending, isSuccess: isRentedCarsSuccess, isLoading: isRentedCarsLoading } = useQuery({
        queryKey: ['rented-cars-search', rentedCarInput],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/panel/rented-cars?nameOrNickname=${rentedCarInput}&page=1&per_page=50`,)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        placeholderData: []
    })
    // Coupon details update function
    const { mutate: updateCoupon, isPending: isUpdateCouponPending, isSuccess: isUpdateCouponSuccess, error: updateCouponError } = useMutation({
        mutationFn: async (formData) => {
            try {
                const bodyFormData = new FormData()
                for (var key in formData) {
                    bodyFormData.append(key, formData[key]);
                }
                const { data } = await axios.put(`/api/panel/coupons/${coupon._id}`, bodyFormData)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['coupons'],
            })
        },
    })
    // Update default values on change in coupon details
    useEffect(() => {
        if (coupon) {
            const updateFields = {
                coupon: coupon.coupon || '',
                shortDesc: coupon.shortDesc || '',
                type: coupon.type || '',
                validOn: coupon.validOn || '',
                userId: coupon.userId || '',
                tourId: coupon.tourId || '',
                rentedCarId: coupon.rentedCarId || '',
                discountType: coupon.discountType || '',
                priceFormat: coupon.priceFormat || '',
                price: coupon.price || '',
                maxPrice: coupon.maxPrice || '',
                maxUsage: coupon.maxUsage || '',
                allowMultipleUsage: coupon.allowMultipleUsage || false,
                expirationDate: new Date(coupon.expirationDate) || new Date(),
                isActive: coupon.isActive || false,
                makePublic: coupon.makePublic || false,
            }
            Object.entries(updateFields).forEach(([name, value]) => form.setValue(name, value));
        }
    }, [coupon, form])
    return (
        <Card className='lg:col-span-2'>
            <CardHeader>
                <CardTitle size='lg'>Edit coupon details</CardTitle>
                <CardDescription>Coupons can be used to give discount to the users or for a marketing campaign.</CardDescription>
                <Message className='mb-4' variant={updateCouponError?.message ? 'destructive' : 'default'} message={updateCouponError?.message || isUpdateCouponSuccess && `Coupon details has been updated successfully.`} />
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(updateCoupon)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name="coupon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Coupon code</FormLabel>
                                    <FormControl>
                                        <Input type='text' className='uppercase' placeholder="WELCOME" {...field} />
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
                                        <Textarea maxLength='160' placeholder="Write here...." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Coupon type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select coupon type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {couponTypes.map((couponType, index) => (
                                                <SelectItem key={index} value={couponType.value}>{couponType.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="validOn"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Valid on</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select valid on" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {couponValidOns.map((couponValidOn, index) => (
                                                <SelectItem key={index} value={couponValidOn.value}>{couponValidOn.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {couponType == 'userOnly' &&
                            <FormField
                                control={form.control}
                                name="userId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>User</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl disabled={couponType != 'userOnly' ? true : false}>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-full justify-between pl-2",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {isUsersLoading && "Loading users..."}
                                                        {isUsersSuccess && field.value && selectedUser
                                                            ? <div className="flex gap-2 items-center">
                                                                <Avatar className='h-8 w-8 rounded-md'>
                                                                    <AvatarImage src={selectedUser.image} alt={'User'} className='object-cover' />
                                                                </Avatar>
                                                                <div className="flex flex-col justify-start items-start">
                                                                    <p className='text-sm font-normal'>{selectedUser.name}</p>
                                                                    <p className='text-xs font-normal'>{selectedUser.email}</p>
                                                                </div>
                                                            </div>
                                                            : "Select a user"
                                                        }
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent align='start' className="w-full p-0">
                                                <Command>
                                                    <div className="flex gap-2 items-center px-2 border-b">
                                                        <Search className='text-muted-foreground w-5 h-5' />
                                                        <Input
                                                            autoComplete="off"
                                                            value={userInput}
                                                            onChange={(e) => { setUserInput(e.target.value) }}
                                                            placeholder="Search by name, email..."
                                                            className="h-9 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                                                        />
                                                    </div>
                                                    <CommandEmpty>No user found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {(isUsersPending || isUsersLoading) &&
                                                            <CommandItem disabled>Loading users...</CommandItem>
                                                        }
                                                        {isUsersSuccess && (users.users || []).map((user) => (
                                                            <CommandItem
                                                                value={user._id}
                                                                key={user._id}
                                                                onSelect={() => {
                                                                    form.setValue("userId", user._id);
                                                                    form.clearErrors("userId");
                                                                    setSelectedUser(user);
                                                                }}
                                                            >
                                                                <div className="flex gap-2 items-center">
                                                                    <Avatar>
                                                                        <AvatarImage src={user.image} alt={user.name} className='object-cover' />
                                                                        <AvatarFallback>{user.name.slice(1)}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="flex flex-col">
                                                                        <p className="text-base font-medium">{user.name}</p>
                                                                        <p className="text-sm">{user.email}</p>
                                                                    </div>
                                                                </div>
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto h-4 w-4",
                                                                        user._id === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                        {isUsersSuccess && users.pageCount > 1 &&
                                                            <>
                                                                <CommandSeparator />
                                                                <p className='p-2 text-muted-foreground text-sm cursor-default'>Please type to search more..</p>
                                                            </>
                                                        }
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        }
                        {validOn == 'tour' &&
                            <FormField
                                control={form.control}
                                name="tourId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Tour</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl disabled={validOn != 'tour' ? true : false}>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-full justify-between pl-2",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {isToursLoading && "Loading tours..."}
                                                        {isToursSuccess && field.value && selectedTour
                                                            ? <div className="flex gap-2 items-center">
                                                                <Avatar className='h-8 w-8 rounded-md'>
                                                                    <AvatarImage src={selectedTour.images[0]} alt={'Tour'} className='object-cover' />
                                                                </Avatar>
                                                                <p className='text-sm font-normal'>{selectedTour.name}</p>
                                                            </div>
                                                            : "Select a tour"
                                                        }
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent align='start' className="w-full p-0">
                                                <Command>
                                                    <div className="flex gap-2 items-center px-2 border-b">
                                                        <Search className='text-muted-foreground w-5 h-5' />
                                                        <Input
                                                            autoComplete="off"
                                                            value={tourInput}
                                                            onChange={(e) => { setTourInput(e.target.value) }}
                                                            placeholder="Search by name..."
                                                            className="h-9 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                                                        />
                                                    </div>
                                                    <CommandEmpty>No tour found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {(isToursPending || isToursLoading) &&
                                                            <CommandItem disabled>Loading tours...</CommandItem>
                                                        }
                                                        {isToursSuccess && (tours.tours || []).map((tour) => (
                                                            <CommandItem
                                                                value={tour._id}
                                                                key={tour._id}
                                                                onSelect={() => {
                                                                    form.setValue("tourId", tour._id);
                                                                    form.clearErrors("tourId");
                                                                    setSelectedTour(tour);
                                                                }}
                                                            >
                                                                <div className="flex gap-2 items-center">
                                                                    <Avatar>
                                                                        <AvatarImage src={tour.images[0]} alt={tour.name} className='object-cover' />
                                                                        <AvatarFallback>{tour.name.slice(1)}</AvatarFallback>
                                                                    </Avatar>
                                                                    <p className="text-base font-medium">{tour.name}</p>
                                                                </div>
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto h-4 w-4",
                                                                        tour._id === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                        {isToursSuccess && tours.pageCount > 1 &&
                                                            <>
                                                                <CommandSeparator />
                                                                <p className='p-2 text-muted-foreground text-sm cursor-default'>Please type to search more..</p>
                                                            </>
                                                        }
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        }
                        {validOn == 'rentedCar' &&
                            <FormField
                                control={form.control}
                                name="rentedCarId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Rented car</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl disabled={validOn != 'rentedCar' ? true : false}>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-full justify-between pl-2",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {isRentedCarsLoading && "Loading rented cars..."}
                                                        {isRentedCarsSuccess && field.value && selectedRentedCar
                                                            ? <div className="flex gap-2 items-center">
                                                                <Avatar className='h-8 w-8 rounded-md'>
                                                                    <AvatarImage src={selectedRentedCar.images[0]} alt={'RentedCar'} className='object-cover' />
                                                                </Avatar>
                                                                <div className="flex flex-col">
                                                                    <p className='text-sm font-normal'>{selectedRentedCar.name}</p>
                                                                    <p className='text-xs font-normal'>{selectedRentedCar.nickname}</p>
                                                                </div>
                                                            </div>
                                                            : "Select a rented car"
                                                        }
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent align='start' className="w-full p-0">
                                                <Command>
                                                    <div className="flex gap-2 items-center px-2 border-b">
                                                        <Search className='text-muted-foreground w-5 h-5' />
                                                        <Input
                                                            autoComplete="off"
                                                            value={rentedCarInput}
                                                            onChange={(e) => { setRentedCarInput(e.target.value) }}
                                                            placeholder="Search by name, nickname..."
                                                            className="h-9 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                                                        />
                                                    </div>
                                                    <CommandEmpty>No rented car found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {(isRentedCarsPending || isRentedCarsLoading) &&
                                                            <CommandItem disabled>Loading rented cars...</CommandItem>
                                                        }
                                                        {isRentedCarsSuccess && (rentedCars.rentedCars || []).map((rentedCar) => (
                                                            <CommandItem
                                                                value={rentedCar._id}
                                                                key={rentedCar._id}
                                                                onSelect={() => {
                                                                    form.setValue("rentedCarId", rentedCar._id);
                                                                    form.clearErrors("rentedCarId");
                                                                    setSelectedRentedCar(rentedCar);
                                                                }}
                                                            >
                                                                <div className="flex gap-2 items-center">
                                                                    <Avatar>
                                                                        <AvatarImage src={rentedCar.images[0]} alt={rentedCar.name} className='object-cover' />
                                                                        <AvatarFallback>{rentedCar.name.slice(1)}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="flex flex-col">
                                                                        <p className='text-sm font-normal'>{rentedCar.name}</p>
                                                                        <p className='text-xs font-normal'>{rentedCar.nickname}</p>
                                                                    </div>
                                                                </div>
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto h-4 w-4",
                                                                        rentedCar._id === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                        {isRentedCarsSuccess && rentedCars.pageCount > 1 &&
                                                            <>
                                                                <CommandSeparator />
                                                                <p className='p-2 text-muted-foreground text-sm cursor-default'>Please type to search more..</p>
                                                            </>
                                                        }
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
                            name="discountType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount type</FormLabel>
                                    <Select onValueChange={(value) => { field.onChange(value); value == 'upto' && form.setValue('priceFormat', 'percentage') }} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select discount type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value='flat'>Flat</SelectItem>
                                            <SelectItem value='upto'>Upto</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="priceFormat"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price format</FormLabel>
                                    <Select onValueChange={(value) => { field.onChange(value); value == 'raw' && form.setValue('discountType', 'flat') }} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select price format" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value='percentage'>Percentage</SelectItem>
                                            <SelectItem value='raw'>Raw</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price {priceFormat == 'percentage' && '(in %)'}</FormLabel>
                                    <FormControl>
                                        <Input type='number' placeholder="999" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {discountType == 'upto' &&
                            <FormField
                                control={form.control}
                                name="maxPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Max price (in Raw)</FormLabel>
                                        <FormControl>
                                            <Input type='number' placeholder="1699" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        }
                        <FormField
                            control={form.control}
                            name="maxUsage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max usage</FormLabel>
                                    <FormControl>
                                        <Input type='number' placeholder="25" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='allowMultipleUsage'
                            render={({ field }) => (
                                <FormItem className="bg-background flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 gap-3">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Allow multiple usage
                                        </FormLabel>
                                        <FormDescription>
                                            This will allow a user to use this coupon multiple times.
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
                            name="expirationDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Coupon expiry date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date(new Date().setHours(0, 0, 0, 0))
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                    <FormDescription>
                                        Coupon will not be usable after expiry date.
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
                                            Activating a coupon will allow users to use this coupon.
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
                            name='makePublic'
                            render={({ field }) => (
                                <FormItem className="bg-background flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 gap-3">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Make public
                                        </FormLabel>
                                        <FormDescription>
                                            Making public a coupon will show it on website publicly.
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
                        <Button type="submit" className='w-full' disabled={isUpdateCouponPending}>
                            {isUpdateCouponPending ?
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

export default EditCoupon