import React, { useState } from 'react'
import { MoreVertical, Pencil, PlusCircle } from 'lucide-react'
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
import EditCity from './edit';
import AddCity from './add';
import DeleteCityDialog from './delete-dialog';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Message from '@/app/_components/ui/message';
import { useToast } from '@/app/_components/ui/use-toast';
import { activeStatusOptions } from "@/app/_conf/constants/constant";

const CitiesTable = ({ state, country }) => {
    const { toast } = useToast()
    // Fetch cities
    const { data, error, isPending, isSuccess, refetch } = useQuery({
        queryKey: ['cities', state._id],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/panel/cities?stateId=${state._id}`)
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        }
    })
    // Citys mutate actions
    const { mutate: mutateCity } = useMutation({
        mutationFn: async ({ city, isActive }) => {
            try {
                const { data } = await axios.patch(`/api/panel/cities/${city._id}`, { isActive })
                return data;
            } catch (error) {
                throw new Error(error.response.data.error)
            }
        },
        onSuccess: (data, variables) => {
            refetch();
            toast({ description: `${variables.city.name} ${variables.isActive == true ? 'activated' : 'deactivated'} successfully.` });
        },
        onError: (error) => {
            toast({ description: error?.message, variant: 'destructive' })
        }
    })
    // Open state for add, edit and delete city
    const [isAddCityOpen, setIsAddCityOpen] = useState(false)
    const [isEditCityOpen, setIsEditCityOpen] = useState(false)
    const [isDeleteCityOpen, setIsDeleteCityOpen] = useState(false)
    const [selectedCity, setSelectedCity] = useState()

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
                                    <TableHead className="w-auto">City</TableHead>
                                    <TableHead className='text-right'><Button onClick={() => setIsAddCityOpen(true)} variant='default' size='sm' className='h-8'><PlusCircle className="mr-2 h-4 w-4" />Add city</Button></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((city, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <p className='text-base font-medium text-foreground'>{city.name}</p>
                                                <p className='text-green-600 text-xs'>17 Tours</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2 justify-end">
                                                <Button onClick={() => { setSelectedCity(city); setIsEditCityOpen(true) }} variant='default' size='icon' className='w-8 h-8'><Pencil className='w-4 h-4' /></Button>
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
                                                        <DropdownMenuItem>View tours</DropdownMenuItem>
                                                        <DropdownMenuSub>
                                                            <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                                                            <DropdownMenuSubContent>
                                                                <DropdownMenuRadioGroup
                                                                    value={city.isActive}
                                                                    onValueChange={(value) => { mutateCity({ city, isActive: value }) }}
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
                                                            onClick={() => { setSelectedCity(city); setIsDeleteCityOpen(true) }}
                                                        >
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {data.length == 0 &&
                            <p className='text-sm text-center text-foreground my-2'>No results.</p>
                        }
                    </div>
                    <AddCity countryId={country._id} stateId={state._id} open={isAddCityOpen} setOpen={setIsAddCityOpen} />
                    {selectedCity && <EditCity city={selectedCity} open={isEditCityOpen} setOpen={setIsEditCityOpen} />}
                    {selectedCity && <DeleteCityDialog city={selectedCity} stateId={state._id} open={isDeleteCityOpen} setOpen={setIsDeleteCityOpen} />}
                </>
            }
        </>
    )
}

export default CitiesTable