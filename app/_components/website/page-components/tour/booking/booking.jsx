'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/app/_components/ui/button'
import BorderLink from '@/app/_components/ui/border-link'
import TourCalendar from './calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover"
import TourTime from './time'
import moment from 'moment'
import TourTravellers from './travellers'
import { Switch } from "@/app/_components/ui/switch"

const TourBooking = ({ bookingDetails }) => {
  // Tour type state >>>>>>>>>>>>>>>>>>>>>>
  const [tourType, setTourType] = useState(bookingDetails.tourTypes[0] || 'shared')

  // Allowed dates state >>>>>>>>>>>>>>>>>>>>>>
  const [allowedDates, setAllowedDates] = useState(bookingDetails?.allowedDates || [])

  // Date state >>>>>>>>>>>>>>>>>>>>>>
  const dateRef = useRef(null);
  const [isCalendarPopoverOpen, setIsCalendarPopoverOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(bookingDetails?.selectedDate || null)

  // Travellers state >>>>>>>>>>>>>>>>>>>>>>
  const [travellers, setTravellers] = useState(1)

  // Time slider state >>>>>>>>>>>>>>>>>>>>>>
  const [selectedTime, setSelectedTime] = useState(() => {
    if (bookingDetails?.times?.length > 0) {
      return bookingDetails.times[0]
    }
    return null
  })

  // To refetech time slots when date changes >>>>>>>>>>>>>>>>>>>>>>
  useEffect(() => {
    console.log('Tour type changed &  date  + new time slots fetched')
  }, [tourType])

  // To refetech dates and time slots when tour type changes >>>>>>>>>>>>>>>>>>>>>>
  useEffect(() => {
    console.log('Date changed & new time slots fetched')
  }, [selectedDate])

  // Tour price state >>>>>>>>>>>>>>>>>>>>>>
  const [tourPrice, setTourPrice] = useState(() => {
    if (selectedDate && allowedDates.length > 0) {
      const price = allowedDates.find((date) =>
        date.date.getDate() === selectedDate.getDate() &&
        date.date.getMonth() === selectedDate.getMonth() &&
        date.date.getFullYear() === selectedDate.getFullYear()
      ).price
      return Number(price) * Number(travellers)
    }
    return 0
  })
  useEffect(() => {
    if (selectedDate && allowedDates.length > 0) {
      const price = allowedDates.find((date) =>
        date.date.getDate() === selectedDate.getDate() &&
        date.date.getMonth() === selectedDate.getMonth() &&
        date.date.getFullYear() === selectedDate.getFullYear()
      ).price
      setTourPrice(Number(price) * Number(travellers))
    }
  }, [selectedDate, travellers, allowedDates])

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
      {/* // Price and private tour switch */}
      <div className="flex gap-2 justify-between">
        <p className={`${selectedDate ? 'text-xl' : 'text-base'}  text-white font-semibold`}> {selectedDate ? `₹ ${tourPrice}*` : 'Select a date'}</p>
        {bookingDetails.tourTypes.length == 2 &&
          <div className="flex gap-3 items-center justify-end">
            <p className='text-base font-semibold text-white'>Private tour</p>
            <Switch checked={tourType == 'private' ? true : false} onCheckedChange={(value) => setTourType(value ? 'private' : 'shared')} className='data-[state=checked]:bg-white' thumbClassName='data-[state=checked]:bg-primary' />
          </div>
        }
      </div>
      <p className='text-xs text-white mt-1.5'>{selectedDate ? `*Price is calculated for ${travellers} person without taxes` : 'Select a date to get the price'}</p>
      {/* // Booking form */}
      <div className="mt-5 bg-background rounded-md p-2">
        <div ref={popoverBodyRef} className="scroll-m-[6rem] lg:scroll-m-[7rem] grid grid-cols-2 gap-3 mt-2">
          {/* // Date and travellers */}
          <Popover open={isCalendarPopoverOpen} onOpenChange={setIsCalendarPopoverOpen}>
            <PopoverTrigger asChild>
              <button ref={dateRef} onClick={() => bringPopoversToFocus()} className="flex flex-col gap-2 p-3 hover:bg-muted rounded-md hover:rounded-l-md focus-visible:ring-1 focus-visible:ring-foreground focus-visible:outline-none">
                <p className='text-muted-foreground text-sm'>Date of travel</p>
                {selectedDate ?
                  <p className='text-lg font-bold'>{moment(selectedDate).format('DD MMM')}</p>
                  : <p className="text-sm font-normal mt-1.5">Select a date...</p>
                }
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className={`max-h-[60vh] bg-background rounded-md border mt-2 overflow-auto p-0`}
              style={{ width: `${popoverWidth}px` }}
            >
              <TourCalendar currentDate={bookingDetails.currentDate} allowedDates={allowedDates} selectedDate={selectedDate} setSelectedDate={setSelectedDate} setIsCalendarPopoverOpen={setIsCalendarPopoverOpen} />
            </PopoverContent>
          </Popover>
          <TourTravellers selectedTime={selectedTime} travellers={travellers} setTravellers={setTravellers} />
        </div>
        {selectedDate && <TourTime selectedTime={selectedTime} setSelectedTime={setSelectedTime} times={bookingDetails?.times} />}
        <Button variant='default' className='mt-4 w-full bg-foreground hover:bg-foreground/90 text-background'>Book Now</Button>
        <div className="mt-3 bg-muted/80 rounded-md p-4">
          <p className='text-foreground text-sm font-medium pl-2 border-r-0 border-foreground border-x-2'>Cancellation available</p>
          <p className='text-sm mt-3 text-muted-foreground'><span className='font-medium text-foreground'>Free cancellation</span> before 2 hours of booking time. <BorderLink href='/contact-us' className='text-sm text-primary ml-1'>See cancellation policy</BorderLink></p>
        </div>
        <p className='text-sm mt-2 ml-1 flex items-center'>Have any questions? <BorderLink href='/contact-us' className='text-sm text-primary ml-1'>Contact us</BorderLink></p>
      </div>
    </div>
  )
}

export default TourBooking