import React, { useEffect } from 'react'
import { Calendar } from '@/app/_components/ui/calendar';
import { cn } from '@/app/_lib/utils';
import { buttonVariants } from '@/app/_components/ui/button';

const CarCalendar = ({ disabledDates, selectedDates, setSelectedDates, setIsCalendarPopoverOpen, currentDate }) => {
    // To set selected dates
    const setNewSelectedDates = (selectedDates) => {
        let stopLoop = false;
        if (selectedDates?.from && selectedDates?.to) {
            for (let date = new Date(selectedDates.from); date <= selectedDates.to; date.setDate(date.getDate() + 1)) {
                if (stopLoop) break;
                if (disabledDates.some((disabledDate) => disabledDate.getDate() === date.getDate() && disabledDate.getMonth() === date.getMonth() && disabledDate.getFullYear() === date.getFullYear())) {
                    setSelectedDates({});
                    stopLoop = true;
                }
            }
            if (!stopLoop) {
                setSelectedDates(selectedDates);
                setIsCalendarPopoverOpen(false);
            }
            return;
        }
        setSelectedDates(selectedDates);
    }
    // To check if the selected dates doesn't include any disabled dates
    useEffect(() => {
        let stopLoop = false;
        if (selectedDates.from && selectedDates.to) {
            for (let date = new Date(selectedDates.from); date <= selectedDates.to; date.setDate(date.getDate() + 1)) {
                if (stopLoop) break;
                if (disabledDates.some((disabledDate) => disabledDate.getDate() === date.getDate() && disabledDate.getMonth() === date.getMonth() && disabledDate.getFullYear() === date.getFullYear())) {
                    setSelectedDates({});
                    stopLoop = true;
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disabledDates])
    return (
        <Calendar
            mode="range"
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
                    "h-10 w-full text-xs p-1 font-normal aria-selected:opacity-100"
                ),
                day_selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-background bprder text-accent-foreground",
                day_outside: "text-foreground opacity-100",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle:
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
            }}
            selected={selectedDates}
            onSelect={setNewSelectedDates}
            disabled={(date) =>
                date < new Date(currentDate) ||
                disabledDates.some((disabledDate) =>
                    disabledDate.getDate() === date.getDate() &&
                    disabledDate.getMonth() === date.getMonth() &&
                    disabledDate.getFullYear() === date.getFullYear()
                )
            }
            initialFocus
        />
    )
}

export default CarCalendar