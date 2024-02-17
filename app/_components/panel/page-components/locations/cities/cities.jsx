import React, { useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/app/_components/ui/sheet"
import CitiesTable from './table'

const Cities = ({ open, setOpen, state, country }) => {
    return (
        <Sheet open={open} onOpenChange={setOpen} className='w-full'>
            <SheetContent className='overflow-auto'>
                <SheetHeader className='text-left'>
                    <div>
                        <SheetTitle>Cities</SheetTitle>
                        <SheetDescription>
                            Manage cities for {state.name}.
                        </SheetDescription>
                    </div>
                </SheetHeader>
                <CitiesTable country={country} state={state} />
            </SheetContent>
        </Sheet>
    )
}

export default Cities