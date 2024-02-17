import React from 'react'

const Itinerary = ({ itineraryItems }) => {
    return (
        <div className="flex flex-col gap-3 mt-10">
            <p className="capitalize text-xl font-bold">What To Expect</p>
            <p className="text-base text-foreground">Travel independently to the Atlantis The Palm in Jumeirah and show your ticket at the entrance to the Aquaventure Waterpark. Go inside and enjoy the rides of this exciting Dubai waterpark at your own pace, for however long you wish, up until the closing time.</p>
            <div className="relative border-s-2 border-foreground mt-5 ml-3">
                {itineraryItems.map((item, index) => (
                    <div key={index} className="mb-5 ms-8">
                        <p className="absolute flex items-center justify-center w-8 h-8 bg-foreground rounded-full -start-4 text-background">
                            {index + 1}
                        </p>
                        <div className="w-full">
                            <p className='text-lg font-bold'>{item.title}</p>
                            <p className='text-sm text-muted-foreground mt-1'>{item.subTitle}</p>
                            <p className='mt-2'>{item.shortDesc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Itinerary