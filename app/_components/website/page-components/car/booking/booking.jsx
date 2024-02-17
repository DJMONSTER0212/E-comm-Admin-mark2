'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/app/_components/ui/button'
import BorderLink from '@/app/_components/ui/border-link'
import CarCalendar from './calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover"
import moment from 'moment'

const CarBooking = ({ bookingDetails }) => {
  // Availability state >>>>>>>>>>>>>>>>>>>>>>
  const [availability, setAvailability] = useState(bookingDetails?.availability || false)

  // Disbabled dates state >>>>>>>>>>>>>>>>>>>>>>
  const [disabledDates, setDisabledDates] = useState(bookingDetails?.disabledDates || [])

  // Date state >>>>>>>>>>>>>>>>>>>>>>
  const dateRef = useRef(null);
  const [isCalendarPopoverOpen, setIsCalendarPopoverOpen] = useState(false)
  const [selectedDates, setSelectedDates] = useState(bookingDetails?.selectedDates || null)
  const selectedDays = moment(selectedDates?.to).diff(moment(selectedDates?.from), 'days') + 1

  // Car price state >>>>>>>>>>>>>>>>>>>>>>
  const [carPrice, setCarPrice] = useState(bookingDetails?.price || 0)
  // To refetech availability when dates are changed
  useEffect(() => {
    console.log('Dates changed & new prices + availability fetched')
    setCarPrice(bookingDetails?.price * selectedDays)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDates, bookingDetails?.price])

  // Popover width >>>>>>>>>>>>>>>>>>>>>>
  const popoverBodyRef = useRef(null);
  const [popoverWidth, setPopoverWidth] = useState(0);
  const updatePopoverWidth = () => {
    const newWidth = popoverBodyRef.current.offsetWidth;
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
    if (popoverBodyRef.current) {
      popoverBodyRef.current.scrollIntoView();
    }
  }
  return (
    <div className="rounded-md p-4 h-fit order-1 lg:order-2 bg-gradient-to-r from-primary/80 to-rose-400 lg:sticky lg:top-2">
      {/* // Price */}
      <p className={`text-xl text-white font-semibold`}>₹ {carPrice}*</p>
      <p className='text-xs text-white mt-1.5'>*Price is calculated for {selectedDays} days without taxes</p>
      {/* // Booking form */}
      <div className="mt-5 bg-background rounded-md p-2">
        {/* // Dates */}
        <Popover open={isCalendarPopoverOpen} onOpenChange={setIsCalendarPopoverOpen}>
          <PopoverTrigger asChild>
            <div ref={popoverBodyRef} className="scroll-m-[6rem] lg:scroll-m-[7rem] grid grid-cols-2 gap-3 mt-2">
              <button ref={dateRef} onClick={() => bringPopoversToFocus()} className="flex flex-col gap-2 p-3 hover:bg-muted rounded-md hover:rounded-l-md focus-visible:ring-1 focus-visible:ring-foreground focus-visible:outline-none">
                <p className='text-muted-foreground text-sm'>Pick up date</p>
                {selectedDates?.from ?
                  <p className='text-lg font-bold'>{moment(selectedDates?.from).format('DD MMM')}</p>
                  : <p className="text-sm font-normal mt-1.5">Select a date...</p>
                }
              </button>
              <button ref={dateRef} onClick={() => bringPopoversToFocus()} className="flex flex-col gap-2 p-3 hover:bg-muted rounded-md hover:rounded-l-md focus-visible:ring-1 focus-visible:ring-foreground focus-visible:outline-none">
                <p className='text-muted-foreground text-sm'>Drop date</p>
                {selectedDates?.to ?
                  <p className='text-lg font-bold'>{moment(selectedDates?.to).format('DD MMM')}</p>
                  : <p className="text-sm font-normal mt-1.5">Select a date...</p>
                }
              </button>
            </div>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className={`max-h-[60vh] bg-background rounded-md border mt-2 overflow-auto p-0`}
            style={{ width: `${popoverWidth}px` }}
          >
            <CarCalendar currentDate={bookingDetails?.currentDate} disabledDates={disabledDates} selectedDates={selectedDates} setSelectedDates={setSelectedDates} setIsCalendarPopoverOpen={setIsCalendarPopoverOpen} />
          </PopoverContent>
        </Popover>
        <Button variant='default' disabled={!availability} className='mt-4 w-full bg-foreground hover:bg-foreground/90 text-background'>{availability ? 'Rent Now' : 'Car is not available!'}</Button>
        <div className="mt-3 bg-muted/80 rounded-md p-4">
          <p className='text-foreground text-sm font-medium pl-2 border-r-0 border-foreground border-x-2'>Cancellation available</p>
          <p className='text-sm mt-3 text-muted-foreground'><span className='font-medium text-foreground'>Free cancellation</span> before 2 hours of booking time. <BorderLink href='/contact-us' className='text-sm text-primary ml-1'>See cancellation policy</BorderLink></p>
        </div>
        <p className='text-sm mt-2 ml-1 flex items-center'>Have any questions? <BorderLink href='/contact-us' className='text-sm text-primary ml-1'>Contact us</BorderLink></p>
      </div>
    </div>
  )
}

export default CarBooking