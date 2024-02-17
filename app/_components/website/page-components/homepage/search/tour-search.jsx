import React, { useEffect, useState, useRef } from 'react'
import { Input } from '@/app/_components/ui/input'
import { Label } from '@/app/_components/ui/label'
import { Calendar as CalendarIcon, Loader2, MapPin, MoveRight } from 'lucide-react'
import { Button } from '@/app/_components/ui/button'
import moment from 'moment'
import Image from 'next/image'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/app/_components/ui/popover"
import { Calendar } from "@/app/_components/ui/calendar"
import { buttonVariants } from "@/app/_components/ui/button"
import { cn } from "@/app/_lib/utils"
import { useRouter } from 'next-nprogress-bar'
import urlSlug from 'url-slug'

const TourSearch = () => {
    // Router >>>>>>>>>>>>>>>>>>>>>>
    const router = useRouter();
    // Function to create url query string
    const createQueryString = (params) => {
        const newSearchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (value === null) {
                newSearchParams.delete(key);
            } else {
                newSearchParams.set(key, String(value));
            }
        }
        return newSearchParams.toString();
    };
    // Search >>>>>>>>>>>>>>>>>>>>>>
    const searchRef = useRef(null);
    const [searchValue, setSearchValue] = useState()
    const [isSearchPopoverOpen, setIsSearchPopoverOpen] = useState(false)
    // Search input
    const [searchInputValue, setSearchInputValue] = useState()
    // Date >>>>>>>>>>>>>>>>>>>>>>
    const dateRef = useRef(null);
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [isCalendarPopoverOpen, setIsCalendarPopoverOpen] = useState(false)
    // Redirect to tours page >>>>>>>>>>>>>>>>>>>>>>
    const [isRedirecting, setIsRedirecting] = useState(false)
    const redirectToToursPage = () => {
        setIsRedirecting(true)
        if (!searchValue?.label || !searchValue?.type || !searchValue?.value) {
            searchRef.current.click();
            setIsRedirecting(false)
            return;
        }
        if (!selectedDate) {
            dateRef.current.click();
            setIsRedirecting(false)
            return;
        }
        switch (searchValue?.type) {
            case 'location':
                router.push(`/explore/tours/${urlSlug(searchValue?.label)}/${searchValue?.value}?${createQueryString({
                    date: moment(selectedDate).format("YYYY-MM-DD")
                })}`)
                break;
            case 'tour':
                router.push(`/tours/${searchValue?.value}?${createQueryString({
                    date: moment(selectedDate).format("YYYY-MM-DD")
                })}`)
                break;
            default:
                searchRef.current.click();
                break;
        }
        setIsRedirecting(false)
    }
    // Popover width >>>>>>>>>>>>>>>>>>>>>>
    const [popoverWidth, setPopoverWidth] = useState(0);
    const updatePopoverWidth = () => {
        const newWidth = searchRef.current.offsetWidth;
        setPopoverWidth(newWidth);
    };
    useEffect(() => {
        updatePopoverWidth();
        const handleResize = () => {
            updatePopoverWidth();
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    // Bring popover to the top >>>>>>>>>>>>>>>>>>>>>>
    const bringPopoversToFocus = () => {
        if (searchRef.current) {
            searchRef.current.scrollIntoView();
        }
    }
    return (
        <div className='relative'>
            <div className='flex flex-col md:flex-row items-center gap-3'>
                <Popover open={isSearchPopoverOpen} onOpenChange={setIsSearchPopoverOpen}>
                    <PopoverTrigger className='scroll-m-[4.8rem] ' asChild>
                        <button ref={searchRef} onClick={() => bringPopoversToFocus()} className='cursor-pointer h-[4.5rem] xs:h-[5.5rem] hover:bg-muted flex flex-col gap-1 md:gap-3 border p-3 rounded-md w-full md:w-[calc(50%-5.75rem/2)] focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none'>
                            <Label className='flex items-center gap-3 uppercase text-muted-foreground'><MapPin className='w-4 h-4' /> Where to ?</Label>
                            {searchValue?.label ?
                                <p className='pl-7 text-xl xs:text-2xl font-bold line-clamp-1'>{searchValue.label}</p>
                                : <p className='pl-7 text-xl xs:text-2xl font-bold'><span className="text-base text-muted-foreground font-normal">Search tour or destination.....</span></p>
                            }
                        </button>
                    </PopoverTrigger>
                    <PopoverContent
                        align="start"
                        className={`max-h-[60vh] bg-background rounded-md border mt-2 overflow-auto p-0`}
                        style={{ width: `${popoverWidth}px` }}
                    >
                        <div className="bg-background p-3 pb-1 sticky top-0 ">
                            <Input
                                value={searchInputValue}
                                onChange={(e) => setSearchInputValue(e.target.value)}
                                placeholder='Search tour or destination..'
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-0.5 p-3">
                            {/* // Country */}
                            <Button variant='ghost' onClick={() => { setSearchValue({ type: 'location', value: 'cr-339', label: 'India' }); setIsSearchPopoverOpen(false); }} className="flex gap-2 items-center h-auto px-2 cursor-pointer py-1 rounded-md hover:bg-muted justify-start">
                                <div className="w-10 flex justify-center items-center"><MapPin className='w-4 h-4 text-primary' /></div>
                                <p className='text-base font-medium'>India</p>
                            </Button>
                            {/* // State */}
                            <Button variant='ghost' onClick={() => { setSearchValue({ type: 'location', value: 'st-225', label: 'Rajasthan' }); setIsSearchPopoverOpen(false); }} className="flex gap-2 items-center h-auto px-2 cursor-pointer py-1 rounded-md hover:bg-muted justify-start">
                                <div className="w-10 flex justify-center items-center"><MapPin className='w-4 h-4 text-primary' /></div>
                                <div className="flex flex-col items-start">
                                    <p className='text-base font-medium'>Rajasthan</p>
                                    <p className='text-sm text-muted-foreground font-normal'>India</p>
                                </div>
                            </Button>
                            {/* // City */}
                            <Button variant='ghost' onClick={() => { setSearchValue({ type: 'location', value: 'ct-895', label: 'Sikar' }); setIsSearchPopoverOpen(false); }} className="flex gap-2 items-center h-auto px-2 cursor-pointer py-1 rounded-md hover:bg-muted justify-start">
                                <div className="w-10 flex justify-center items-center"><MapPin className='w-4 h-4 text-primary' /></div>
                                <div className="flex flex-col items-start">
                                    <p className='text-base font-medium'>Sikar</p>
                                    <p className='text-sm text-muted-foreground font-normal'>Rajasthan, India</p>
                                </div>
                            </Button>
                            {/* // Tour */}
                            <Button variant='ghost' onClick={() => { setSearchValue({ type: 'tour', value: 'jaipur-city-tour', label: 'Jaipur city tour Jaipur city tour Jaipur city tour' }); setIsSearchPopoverOpen(false); }} className="h-auto px-2 py-1 rounded-md hover:bg-muted justify-start">
                                <div className="flex gap-2 items-center">
                                    <Image src='/ds.jpg' alt='Image' width={40} height={40} className='aspect-square rounded-md object-cover' />
                                    <div className="flex flex-col items-start">
                                        <p className='text-base font-medium'>Jaipur city tour</p>
                                        <p className='text-sm text-muted-foreground font-normal'>Jaipur, Rajasthan, India</p>
                                    </div>
                                </div>
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
                <Popover open={isCalendarPopoverOpen} onOpenChange={setIsCalendarPopoverOpen}>
                    <PopoverTrigger asChild>
                        <button ref={dateRef} onClick={() => bringPopoversToFocus()} className='cursor-pointer h-[4.5rem] xs:h-[5.5rem] hover:bg-muted flex flex-col gap-1 md:gap-3 border p-3 rounded-md w-full md:w-[calc(50%-5.75rem/2)] focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none'>
                            <Label className='flex items-center gap-3 uppercase text-muted-foreground'><CalendarIcon className='w-4 h-4' /> When ?</Label>
                            <p className='pl-7 text-xl xs:text-2xl font-bold' >{moment(selectedDate).format("DD MMM YYYY")}</p>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent
                        align="start"
                        onOpenAutoFocus={(e) => e.preventDefault()}
                        className={`max-h-[60vh] grid grid-cols-1 gap-0.5 bg-background p-1 rounded-md border mt-2`}
                        style={{ width: `${popoverWidth}px` }}
                    >
                        <Calendar
                            mode="single"
                            classNames={{
                                months: "w-full",
                                caption_label: "text-sm font-medium",
                                table: "w-full border-collapse space-y-1",
                                head_row: "grid grid-cols-7",
                                head_cell:
                                    "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                                row: "grid grid-cols-7 w-full mt-2",
                                cell: "h-10 w-full text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                day: cn(
                                    buttonVariants({ variant: "ghost" }),
                                    "h-10 w-full p-0 font-normal aria-selected:opacity-100"
                                ),
                                day_selected:
                                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                day_today: "bg-background text-accent-foreground",
                                day_outside: "text-foreground opacity-100",
                                day_disabled: "text-muted-foreground opacity-50",
                                day_range_middle:
                                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                day_hidden: "invisible",
                            }}
                            selected={selectedDate}
                            onSelect={(selectedDate) => { setSelectedDate(selectedDate); setIsCalendarPopoverOpen(false); }}
                            disabled={(date) =>
                                date.getTime() < new Date().setUTCHours(0, 0, 0, 0)
                            }
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <Button disabled={isRedirecting} onClick={redirectToToursPage} className='md:aspect-square h-auto w-full md:w-[5.5rem]'>
                    {isRedirecting ?
                        <Loader2 className='animate-spin w-4 h-4' />
                        : <>
                            <span className='md:hidden'>Find tours</span>
                            <MoveRight className='min-w-7 min-h-7' />
                        </>
                    }
                </Button>
            </div>
        </div >
    )
}

export default TourSearch