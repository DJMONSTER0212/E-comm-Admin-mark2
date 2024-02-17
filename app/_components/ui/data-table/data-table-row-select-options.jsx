import React, { useEffect } from 'react';
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Wand } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { cn } from '@/app/_lib/utils';
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/app/_components/ui/dropdown-menu";
import Message from "../message";
import { useSpring, animated } from '@react-spring/web'

const DataTableRowSelectOperations = ({ table, selectOperations = [] }) => {
    const [isAnimated, setIsAnimated] = React.useState(false);
    const selectedRows = table.getSelectedRowModel().flatRows;

    const springProps = useSpring({
        from: { transform: 'translateX(100%)' },
        to: { transform: isAnimated ? 'translateX(0%)' : 'translateX(100%)' },
    });

    useEffect(() => {
        setIsAnimated(selectedRows.length > 0);
    }, [selectedRows]);

    return (
        <>
            {selectedRows.length > 0 &&
                <animated.div className="fixed top-16 right-0 w-[70%] xs:w-[50%] sm:w-[40%] lg:w-[30%] xl:w-[25%] bg-foreground p-4 rounded-l" style={springProps}>
                    <p className="text-background text-md font-semibold">Select an operation to perform on selected rows</p>
                    <Message variant='destructive' message='Be carefull while performing these operations. As these may cause a big data change.' className='mt-5' />
                    <div className="mt-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                >
                                    <Wand className="mr-2 h-4 w-4" />
                                    Select operation
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuLabel>Select operation</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {selectOperations.length > 0 ? selectOperations.map((operation) => {
                                    return (
                                        <DropdownMenuItem
                                            key={operation.title}
                                            className={cn("capitalize", operation.className)}
                                            onClick={() => operation.operation()}
                                        >
                                            {operation.title}
                                        </DropdownMenuItem>
                                    );
                                }) :
                                    <DropdownMenuItem
                                        key={'No operations found'}
                                        disabled={true}
                                    >
                                        No operations found
                                    </DropdownMenuItem>
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </animated.div>
            }
        </>
    );
}

export default DataTableRowSelectOperations;
