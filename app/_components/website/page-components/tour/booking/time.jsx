import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/app/_components/ui/carousel'
import { Button } from '@/app/_components/ui/button'

const TourTime = ({ times, selectedTime, setSelectedTime, currentDate }) => {
    // Slider options >>>>>>>>>>>>>>>>>>>>>>
    const timeSliderOptions = {
        dragFree: true,
        breakpoints: {
            '(min-width: 1000px)': { slidesToScroll: 5 },
            '(min-width: 768px)': { slidesToScroll: 3 },
            '(min-width: 500px)': { slidesToScroll: 2 },
        }
    }

    return (
        <div className="flex flex-col gap-3 px-2 mt-3">
            <p className='text-muted-foreground text-sm'>Select time</p>
            {times?.length > 0 ?
                <Carousel opts={timeSliderOptions}>
                    <CarouselContent className='-ml-3 p-0.5'>
                        {times?.map((time, index) => (
                            <CarouselItem key={index} className='basis-auto pl-3'>
                                <Button onClick={() => setSelectedTime(time)} variant={JSON.stringify(selectedTime) == JSON.stringify(time) ? 'outline' : 'secondary'} className='border-primary h-auto flex-col'>
                                    {time.time}
                                    <p className='text-xs mt-1'>Max. Persons = {time.maxPerson}</p>
                                </Button>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className='max-xs:hidden absolute left-0 disabled:hidden rounded-sm shadow-md' />
                    <CarouselNext className='max-xs:hidden absolute right-0 disabled:hidden rounded-sm shadow-md' />
                </Carousel> :
                <p className='text-muted-foreground text-sm'>No tours available on this date</p>
            }
        </div>
    )
}

export default TourTime