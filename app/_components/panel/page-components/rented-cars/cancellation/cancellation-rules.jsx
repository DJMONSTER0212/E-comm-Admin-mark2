import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/_components/ui/card"
import { PlusCircle, MoreVertical, Pencil } from 'lucide-react';
import { Button } from '@/app/_components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import AddCancellationRule from './add-cancellation-rule';
import DeleteCancellationRuleDialog from './delete-cancellation-rule-dialog';
import EditCancellationRule from './edit-cancellation-rule';

const RentedCarCancellationRules = ({ rentedCar }) => {
    function convertHoursToDaysAndHours(hours) {
        if (isNaN(hours) || hours < 0) {
            return 'Invalid input';
        }
        if (hours === 0) {
            return '0 Hours';
        }
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        let result = '';
        if (days > 0) {
            result += `${days} Day${days !== 1 ? 's' : ''}`;
        }
        if (remainingHours > 0) {
            result += `${days > 0 ? ' and ' : ''}${remainingHours} Hour${remainingHours !== 1 ? 's' : ''}`;
        }
        return result;
    }
    // Open state for add, edit, delete and selected cancellation rule
    const [isAddCancellationRuleOpen, setIsAddCancellationRuleOpen] = useState(false)
    const [isEditCancellationRuleOpen, setIsEditCancellationRuleOpen] = useState(false)
    const [isDeleteCancellationRuleDialogOpen, setIsDeleteCancellationRuleDialogOpen] = useState(false)
    const [selectedCancellationRule, setSelectedCancellationRule] = useState()
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle size='lg'>Cancellation rules</CardTitle>
                    <CardDescription>Cancellation rules decides what amount of paid price should be refunded</CardDescription>
                </CardHeader>
                <CardContent>
                    {rentedCar.cancellationRules.length > 0 ? <div className={"grid grid-cols-1 gap-3 mb-5"}>
                        {rentedCar.cancellationRules.map((rule) => (
                            <div key={rule._id} className='border-l border-s-2 border-foreground pl-2'>
                                <div className='flex gap-2 justify-between items-start'>
                                    <p className='text-base font-semibold'>{rule.rule}</p>
                                    <div className="flex gap-2">
                                        <Button onClick={() => { setSelectedCancellationRule(rule); setIsEditCancellationRuleOpen(true) }} variant="outline" className="drag-btn flex h-8 w-8 p-0 data-[state=open]:bg-muted cursor-pointer">
                                            <Pencil className="h-4 w-4" aria-hidden="true" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    aria-label="Open menu"
                                                    variant="outline"
                                                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                                                >
                                                    <MoreVertical className="h-4 w-4" aria-hidden="true" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-auto">
                                                <DropdownMenuItem
                                                    className='text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer'
                                                    onClick={() => { setSelectedCancellationRule(rule); setIsDeleteCancellationRuleDialogOpen(true) }}
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                <p className='text-sm text-muted-foreground'>{rule.refundablePrice} percent price of paid price will be refunded if cancelled before {convertHoursToDaysAndHours(rule.hoursBeforeStartingTime)}</p>
                            </div>
                        ))}
                    </div >
                        : <p className='mb-5 text-base text-muted-foreground'>No cancellation rules found. Please add one.</p>
                    }
                    <Button onClick={() => setIsAddCancellationRuleOpen(true)} variant='default' className='w-full'><PlusCircle className="w-5 h-5 mr-2" />Add new</Button>
                </CardContent>
            </Card>
            <AddCancellationRule open={isAddCancellationRuleOpen} setOpen={setIsAddCancellationRuleOpen} rentedCar={rentedCar} />
            {selectedCancellationRule && <EditCancellationRule open={isEditCancellationRuleOpen} setOpen={setIsEditCancellationRuleOpen} rentedCar={rentedCar} cancellationRule={selectedCancellationRule} />}
            {selectedCancellationRule && <DeleteCancellationRuleDialog open={isDeleteCancellationRuleDialogOpen} setOpen={setIsDeleteCancellationRuleDialogOpen} rentedCar={rentedCar} cancellationRule={selectedCancellationRule} />}
        </>
    )
}

export default RentedCarCancellationRules