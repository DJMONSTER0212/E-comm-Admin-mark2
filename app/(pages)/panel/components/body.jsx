import React from 'react'

const Body = ({ children }) => {
    return (
        <div className="w-full md:w-[calc(100%-300px)] fixed right-0 h-[calc(100vh-60px)] md:h-screen max-h-screen overflow-auto py-4">
            {children}
        </div>
    )
}

export default Body