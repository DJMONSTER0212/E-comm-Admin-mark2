import React from 'react'
import Sidebar from './components/sidebar'
import LeadCards from './components/lead-cards'

const layout = ({ children }) => {
    return (
        <div className='max-w-screen-xl mx-auto p-screen grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-16 md:gap-5 mt-10'>
            <Sidebar />
            <div className="w-full md:w-[90%] lg:w-[80%] xl:w-[70%] mx-auto md:col-span-2 lg:col-span-3 order-1 md:order-2">
                {children}
                <LeadCards />
            </div>
        </div>
    )
}

export default layout