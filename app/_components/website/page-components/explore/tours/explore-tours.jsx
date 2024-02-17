'use client'
import React, { Suspense, useEffect } from 'react'
import Pagignation from './pagignation'
import Tours from './tours'
import { useStickyWrapper } from '@/app/(pages)/(website)/explore/tours/hooks/use-sticky-wrapper'

const ExploreTours = ({ value }) => {
    const { wrapperDetails, setWrapperDetails } = useStickyWrapper()
    useEffect(() => {
        if (value.length == 2) {
            setWrapperDetails({
                ...wrapperDetails,
                search: {
                    label: value[0],
                    type: 'location',
                    value: value[1]
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, setWrapperDetails])
    return (
        <>
            {/* <ExploreTourStickyWrapper /> */}
            <Tours />
            <Suspense>
                <Pagignation perPage={40} totalPages={6} className='mt-5' />
            </Suspense>
        </>
    )
}

export default ExploreTours