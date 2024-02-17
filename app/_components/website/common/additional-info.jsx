import React from 'react'

const AdditionalInfo = () => {
    return (
        <div className="mt-10">
            <p className='text-xl font-semibold'>Additional info</p>
            <div className="grid grid-cols-1 gap-3 mt-5">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-foreground rounded-full" />
                    <p className='text-foreground text-base'>Please don&lsquo;t bring pets.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-foreground rounded-full" />
                    <p className='text-foreground text-base'>VIP access to iconic landmarks and hidden gems.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-foreground rounded-full" />
                    <p className='text-foreground text-base'>Relaxing spa day at a world-class resort.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-foreground rounded-full" />
                    <p className='text-foreground text-base'>Private cooking class with a renowned local chef.</p>
                </div>
            </div>
        </div>
    )
}

export default AdditionalInfo