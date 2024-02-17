import { Button } from '@/app/_components/ui/button'
import { Minus, Plus } from 'lucide-react'
import React, { useEffect } from 'react'

const TourTravellers = ({ selectedTime, travellers, setTravellers }) => {
    // Is plus person disabled >>>>>>>>>>>>>>>>>>>>>>
    const isPlusPersonDisabled = travellers + 1 > (selectedTime?.maxPerson || 1);
    // Is minus person disabled >>>>>>>>>>>>>>>>>>>>>>
    const isMinusPersonDisabled = travellers - 1 < (selectedTime?.minPerson || 1);
    // To keep the travellers within the range of min and max persons
    useEffect(() => {
        if (travellers < (selectedTime?.minPerson || 1)) {
            setTravellers(selectedTime?.minPerson || 1)
        }
        if (travellers > (selectedTime?.maxPerson || 1)) {
            setTravellers(selectedTime?.maxPerson || 1)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTime])
    return (
        <div className="flex flex-col gap-2 p-3">
            <p className='text-muted-foreground text-sm'>Travellers</p>
            <div className="flex items-center gap-2 justify-between w-full">
                <p className='text-lg font-bold'>{travellers}</p>
                <div className="flex items-center gap-1.5">
                    <Button variant='outline' size='icon'
                        onClick={() => setTravellers(Math.max(selectedTime?.minPerson || 1, travellers - 1))}
                        disabled={isMinusPersonDisabled}
                        className='w-6 h-6 rounded-full'
                    >
                        <Minus className='w-4 h-4' />
                    </Button>
                    <Button variant='outline' size='icon'
                        onClick={() => setTravellers(Math.min(selectedTime?.maxPerson || 1, travellers + 1))}
                        disabled={isPlusPersonDisabled}
                        className='w-6 h-6 rounded-full'
                    >
                        <Plus className='w-4 h-4' />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default TourTravellers