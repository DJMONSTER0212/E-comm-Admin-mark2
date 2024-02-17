'use client'
import React, { useRef, useState } from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from 'next/image';
import { MoveRight, MoveLeft } from 'lucide-react';
import { Button } from '@/app/_components/ui/button';
import EditCarDetails from './edit-car-details';

const CarDetails = ({ rentedCar }) => {
    const slider = useRef();
    const moveRight = () => {
        slider.current.slickNext();
    };
    const moveLeft = () => {
        slider.current.slickPrev();
    };
    // Open state to edit car details
    const [isEditCarOpen, setIsEditCarOpen] = useState(false)
    return (
        <>
            <div className="relative rounded-md overflow-hidden">
                <Slider ref={slider} className='w-full overflow-hidden bg-black' arrows={false} dots={false} infinite={true} speed={500} slidesToShow={1} slidesToScroll={1} autoplay={true} lazyLoad='ondemand'>
                    {rentedCar.images.length > 0 && rentedCar.images.map((image, index) => (
                        <Image key={index} src={image} width={400} height={400} alt={rentedCar.name} className='opacity-60 bg-blend-darken aspect-[4/3] object-cover' />
                    ))}
                </Slider>
                <div className='absolute bottom-2 left-2 right-2 flex justify-between items-center gap-2'>
                    <div className="flex flex-col w-full">
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                <h2 className='text-lg font-bold text-background dark:text-foreground'>{rentedCar.name}</h2>
                                <p className='text-xs font-medium text-background dark:text-foreground'>{rentedCar.modelYear}</p>
                            </div>
                            <Button variant='outline' size='sm' className='h-6 rounded-sm' onClick={() => { setIsEditCarOpen(true) }}>Edit</Button>
                        </div>
                        <p className='text-sm font-medium text-background dark:text-foreground capitalize'>{rentedCar.carCategory} by {rentedCar.carCompany.name} {rentedCar.fuelType && ' | ' + rentedCar.fuelType}</p>
                    </div>
                </div>
                <div className="flex gap-5 items-center absolute top-2 right-3 z-2">
                    <MoveLeft onClick={moveLeft} className='h-5 w-5 text-background dark:text-foreground cursor-pointer' />
                    <MoveRight onClick={moveRight} className='h-5 w-5 text-background dark:text-foreground cursor-pointer' />
                </div>
            </div>
            <EditCarDetails rentedCar={rentedCar} open={isEditCarOpen} setOpen={setIsEditCarOpen} />
        </>
    )
}

export default CarDetails