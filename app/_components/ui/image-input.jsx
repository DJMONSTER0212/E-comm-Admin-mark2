import React, { useRef } from 'react'
import { ReactSortable } from "react-sortablejs";
import { PlusCircle, X, Upload, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./dropdown-menu"
import Image from 'next/image';
import { Button } from './button';
import { Input } from './input';
import { cn } from '@/app/_lib/utils';

const ImageInput = ({ field, multiple, sortable, imageGridClassName, imageClassName }) => {
    // Single image upload >>>>>>>>>
    const imageInput = useRef();
    // Multiple image upload >>>>>>>>>>>
    const multiImageInput = useRef();
    const addImage = (images) => {
        field.onChange([...field.value || [], ...images])
    }
    const removeImage = (index) => {
        field.onChange(field.value.filter((image, ImageIndex) => ImageIndex != index))
    }
    if (multiple) {
        return (
            <>
                {(field.value && field.value.length > 0) ?
                    <>
                        <ReactSortable
                            list={field.value}
                            disabled={!sortable}
                            setList={(sortedImages) => { field.onChange(sortedImages) }}
                            draggable='.image'
                            className={cn("max-sm:grid max-sm:grid-cols-1 xs:flex xs:flex-wrap gap-3 min-h-[100px]", imageGridClassName)}
                        >
                            {(field.value && field.value.length > 0) && field.value.map((image, index) => (
                                <div key={image} className="relative bg-muted flex justify-center items-center rounded-md p-0.5 image">
                                    <Image src={image instanceof Blob ? URL.createObjectURL(image) : image.toString()} alt="Image" width={300} height={300} className={cn("w-full xs:max-w-[200px] xs:max-h-[130px] relative cursor-pointer rounded-md", imageClassName)} />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="absolute top-1 right-1" asChild><Button variant='outline' size='xs' className='data-[state=open]:bg-muted rounded-sm p-0.5'><MoreHorizontal className="w-6 h-6" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align='end'>
                                            <DropdownMenuItem onClick={() => { removeImage(index); }} className='cursor-pointer'><X className="w-5 h-5 text-destructive mr-3" /> Remove</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))}
                            <div className="relative">
                                <div onClick={() => multiImageInput.current.click()} className="min-h-[100px] h-full min-w-[100px] bg-muted flex justify-center items-center rounded-md p-0.5 cursor-pointer">
                                    <PlusCircle className="w-10 h-10 text-muted-foreground absolute top-[50%] -translate-y-[50%] mx-auto left-0 right-0" />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="absolute top-1 right-1" asChild><Button variant='outline' size='xs' className='data-[state=open]:bg-muted rounded-sm p-0.5'><MoreHorizontal className="w-6 h-6" /></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent align='end'>
                                        <DropdownMenuItem onClick={() => { field.onChange([]); }} className='cursor-pointer'><X className="w-5 h-5 text-destructive mr-3" /> Remove all</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </ReactSortable >
                    </>
                    :
                    <div className="relative">
                        <div onClick={() => multiImageInput.current.click()} className="min-h-[100px] h-full min-w-[100px] bg-muted flex justify-center items-center rounded-md p-0.5 cursor-pointer">
                            <PlusCircle className="w-10 h-10 text-muted-foreground absolute top-[50%] -translate-y-[50%] mx-auto left-0 right-0" />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="absolute top-1 right-1" asChild><Button variant='outline' size='xs' className='data-[state=open]:bg-muted rounded-sm p-0.5'><MoreHorizontal className="w-6 h-6" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuItem onClick={() => { field.onChange([]); }} className='cursor-pointer'><X className="w-5 h-5 text-destructive mr-3" /> Remove all</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                }
                <div className="w-0 h-0 opacity-0 overflow-hidden">
                    <Input ref={(e) => { field.ref(e); multiImageInput.current = e }} onChange={(e) => addImage(Array.from(e.target.files))} type="file" multiple={true} />
                </div>
            </>
        )
    } else {
        return (
            <div>
                {field.value ?
                    <div className="relative bg-muted flex justify-center items-center rounded-md p-0.5 min-h-[50px]">
                        <Image src={field.value instanceof Blob ? URL.createObjectURL(field.value) : field.value} alt="Image" width={200} height={150} className={cn("w-auto max-w-[100px] max-h-[100px] relative cursor-pointer rounded-md", imageClassName)} />
                        <DropdownMenu>
                            <DropdownMenuTrigger className="absolute top-1 right-1" asChild><Button variant='outline' size='xs' className='data-[state=open]:bg-muted rounded-sm p-0.5'><MoreHorizontal className="w-6 h-6" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuItem onClick={() => imageInput.current.click()} className='cursor-pointer'><Upload className="w-5 h-5 mr-3" /> Edit</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { field.onChange(''); imageInput.current.value = '' }} className='cursor-pointer'><X className="w-5 h-5 text-destructive mr-3" /> Remove</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div> :
                    <div onClick={() => imageInput.current.click()} className="h-[100px] w-[100px] relative bg-muted flex justify-center items-center rounded-md p-0.5 cursor-pointer">
                        <PlusCircle className="w-10 h-10 text-muted-foreground absolute top-[50%] -translate-y-[50%] mx-auto left-0 right-0" />
                    </div>
                }
                <div className="w-0 h-0 opacity-0 overflow-hidden">
                    <Input ref={(e) => { field.ref(e); imageInput.current = e }} onChange={(e) => field.onChange(e.target.files[0])} type="file" />
                </div>
            </div>
        )
    }
}

export default ImageInput