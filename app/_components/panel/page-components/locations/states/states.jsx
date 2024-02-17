import React, { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/app/_components/ui/button'
import AddState from './add';
import StatesTable from './table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card"

const States = ({ country }) => {
  // Open state for add state
  const [isAddStateOpen, setIsAddStateOpen] = useState(false)
  return (
    <>
      <Card className="order-2 lg:order-1 md:col-span-2 row-span-5">
        <CardHeader>
          <div className="flex items-center gap-2 justify-between">
            <div className="flex flex-col">
              <CardTitle size='lg'>States</CardTitle>
              <CardDescription>Add state to manage cities and tours.</CardDescription>
            </div>
            <Button onClick={() => setIsAddStateOpen(true)} variant='default' size='sm' className='h-8'><PlusCircle className="mr-2 h-4 w-4" />Add state</Button>
          </div>
        </CardHeader>
        <CardContent>
          <StatesTable country={country} />
        </CardContent>
      </Card>
      <AddState countryId={country._id} open={isAddStateOpen} setOpen={setIsAddStateOpen} />
    </>
  )
}

export default States