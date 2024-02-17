import React from 'react'

const NotFound = () => {
  return (
      <div className="grid h-screen px-4 place-content-center">
        <div className="text-center">
          <h1 className="font-bold text-muted-foreground/30 text-7xl md:text-9xl">404</h1>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Uh-oh! Page not found</p>
          <p className="mt-2 text-muted-foreground">We can&lsquo;t find the page you are looking for.</p>
        </div>
      </div>
  )
}

export default NotFound