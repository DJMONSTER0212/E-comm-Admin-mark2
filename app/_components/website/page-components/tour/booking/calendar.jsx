import React, { useEffect } from 'react'
import { Calendar } from '@/app/_components/ui/calendar';
import { cn } from '@/app/_lib/utils';
import { buttonVariants } from '@/app/_components/ui/button';
import { format } from 'date-fns';
import { DayContent } from 'react-day-picker';

const DateTime = (props) => {
    const { allowedDates, date } = props;
    const dateTime = format(date, 'yyyy-MM-dd');
    return (
        <time dateTime={dateTime}>
            <DayContent {...props} />
            {allowedDates.map((allowedDate) => {
                if (
                    allowedDate.date.getDate() === date.getDate() &&
                    allowedDate.date.getMonth() === date.getMonth() &&
                    allowedDate.date.getFullYear() === date.getFullYear()
                ) {
                    return (
                        <p key={allowedDate.date.getTime()} className='text-[10px] font-medium mt-1'>
                            ₹ {allowedDate.price}
                        </p>
                    );
                }
                return null;
            })}
        </time>
    );
}

const TourCalendar = ({ allowedDates, selectedDate, setSelectedDate, setIsCalendarPopoverOpen }) => {
    // To check if the selected date is allowed
    useEffect(() => {
        if (allowedDates.length > 0 && selectedDate) {
            if (!allowedDates.some((allowedDate) =>
                allowedDate.date.getDate() === selectedDate.getDate() &&
                allowedDate.date.getMonth() === selectedDate.getMonth() &&
                allowedDate.date.getFullYear() === selectedDate.getFullYear()
            )) {
                setSelectedDate(null);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allowedDates])
    return (
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
                cell: "h-auto w-full text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-full w-full text-xs p-1 font-normal aria-selected:opacity-100"
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
                !allowedDates.some((allowedDate) =>
                    allowedDate.date.getDate() === date.getDate() &&
                    allowedDate.date.getMonth() === date.getMonth() &&
                    allowedDate.date.getFullYear() === date.getFullYear()
                )
            }
            components={{ DayContent: (props) => <DateTime allowedDates={allowedDates} {...props} /> }}
            initialFocus
        />
    )
}

export default TourCalendar