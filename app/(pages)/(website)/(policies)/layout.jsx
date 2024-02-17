import React from 'react'
import Sidebar from './components/sidebar'

const layout = ({ children }) => {
    return (
        <div className='max-w-screen-xl mx-auto p-screen grid grid-cols-1 md:grid-cols-5 lg:grid-cols-4 gap-16 md:gap-5 mt-10'>
            <Sidebar />
            <div className="w-full md:pl-5 lg:pl-10 xl:pl-20 mx-auto md:col-span-3 order-1 md:order-2">
                {children}
            </div>
        </div>
    )
}

export default layout