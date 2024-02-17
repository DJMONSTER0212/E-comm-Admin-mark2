import { Check, Package, X } from 'lucide-react'
import React from 'react'

const Includes = ({forCar}) => {
    return (
        <div className="p-5 border rounded-md mt-10">
            <p className='text-xl font-semibold flex items-center gap-3'><Package className='w-5 h-5' /> What&apos;s included in the {forCar ? 'car booking' : 'tour'}</p>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 min-w-[1.25rem]" />
                        <p className='text-foreground text-base -mt-1'>Luxurious stay in Taj Hotel with stunning sea views.</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 min-w-[1.25rem]" />
                        <p className='text-foreground text-base -mt-1'>VIP access to iconic landmarks and hidden gems.</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 min-w-[1.25rem]" />
                        <p className='text-foreground text-base -mt-1'>Relaxing spa day at a world-class resort.</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 min-w-[1.25rem]" />
                        <p className='text-foreground text-base -mt-1'>Private cooking class with a renowned local chef.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-start gap-2">
                        <X className="w-5 h-5 min-w-[1.25rem]" />
                        <p className='text-foreground text-base -mt-1'>Airfare to and from the destination.</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <X className="w-5 h-5 min-w-[1.25rem]" />
                        <p className='text-foreground text-base -mt-1'>Personal expenses such as souvenirs and additional activities.</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <X className="w-5 h-5 min-w-[1.25rem]" />
                        <p className='text-foreground text-base -mt-1'>Gratuities for guides, drivers, and hotel staff.</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <X className="w-5 h-5 min-w-[1.25rem]" />
                        <p className='text-foreground text-base -mt-1'>Medical expenses or medication.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Includes