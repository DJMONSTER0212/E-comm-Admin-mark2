import React, { useState } from 'react'
import { MoreVertical, Building2 } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/_components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Button } from '@/app/_components/ui/button'
import { Badge } from '@/app/_components/ui/badge';
import EditState from './edit';
import DeleteStateDialog from './delete-dialog';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Message from '@/app/_components/ui/message';
import { useToast } from '@/app/_components/ui/use-toast';
import Cities from '../cities/cities';
import { activeStatusOptions } from "@/app/_conf/constants/constant";

const StatesTable = ({ country }) => {
    const { toast } = useToast()
    // Fetch states
    const { data, error, isPending, isSuccess, refetch } = useQuery({
        queryKey: ['states', country._id],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/panel/states?countryId=${country._id}&totalCities=true`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        }
    })
    // States mutate actions
    const { mutate: mutateState } = useMutation({
        mutationFn: async ({ state, isActive }) => {
            try {
                const { data } = await axios.patch(`/api/panel/states/${state._id}`, { isActive })
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            refetch();
            toast({ description: `${variables.state.name} ${variables.isActive == true ? 'activated' : 'deactivated'} successfully.` });
        },
        onError: (error) => {
            toast({ description: error?.message, variant: 'destructive' })
        }
    })
    // Open state for edit and delete state
    const [isEditStateOpen, setIsEditStateOpen] = useState(false)
    const [isDeleteStateOpen, setIsDeleteStateOpen] = useState(false)
    const [selectedState, setSelectedState] = useState()
    // Open state for cities
    const [isCitiesOpen, setIsCitiesOpen] = useState(false)
    return (
        <>
            <Message variant={error ? 'destructive' : 'default'} message={error?.message} className='mt-3' />
            {isPending && 'Loading...'}
            {isSuccess &&
                <>
                    <div className='bg-background border rounded-md mt-3'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-auto">State</TableHead>
                                    <TableHead>Stats</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((state, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{state.name}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                <Badge className='bg-orange-500 font-normal whitespace-nowrap'>{state.totalCities} Cities</Badge>
                                                <Badge className='bg-green-500 font-normal whitespace-nowrap'>5 Tours</Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>{state.isActive ? <Badge>Activated</Badge> : <Badge variant="destructive">Deactivated</Badge>}</TableCell>
                                        <TableCell className="flex gap-2 justify-end">
                                            <Button onClick={() => { setSelectedState(state); setIsCitiesOpen(true) }} variant='default' size='icon' className='w-8 h-8'><Building2 className='w-4 h-4' /></Button>
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
                                                    <DropdownMenuItem onClick={() => { setSelectedState(state); setIsEditStateOpen(true) }}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => { setSelectedState(state); setIsEditStateOpen(true) }}>View tours</DropdownMenuItem>
                                                    <DropdownMenuSub>
                                                        <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                                                        <DropdownMenuSubContent>
                                                            <DropdownMenuRadioGroup
                                                                value={state.isActive}
                                                                onValueChange={(value) => { mutateState({ state, isActive: value }) }}
                                                            >
                                                                {activeStatusOptions.map((status) => (
                                                                    <DropdownMenuRadioItem
                                                                        key={status.value}
                                                                        value={status.value}
                                                                        className='cursor-pointer'
                                                                    >
                                                                        {status.label}
                                                                    </DropdownMenuRadioItem>
                                                                ))}
                                                            </DropdownMenuRadioGroup>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuSub>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className='text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer'
                                                        onClick={() => { setSelectedState(state); setIsDeleteStateOpen(true) }}
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {data.length == 0 &&
                            <p className='text-sm text-center text-foreground my-2'>No results.</p>
                        }
                    </div>
                    {selectedState && <EditState state={selectedState} open={isEditStateOpen} setOpen={setIsEditStateOpen} />}
                    {selectedState && <DeleteStateDialog state={selectedState} open={isDeleteStateOpen} setOpen={setIsDeleteStateOpen} />}
                    {selectedState && <Cities country={country} state={selectedState} open={isCitiesOpen} setOpen={setIsCitiesOpen} />}
                </>
            }
        </>
    )
}

export default StatesTable