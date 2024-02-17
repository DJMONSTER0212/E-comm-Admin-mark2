import React, { useState, useEffect } from "react";
import TimeInput from "./time-input";
import { Button } from "./button";
import { Plus, X } from 'lucide-react';

const MultipleTimeInput = ({ onChange, value = [], disabledTimes = [], disabled }) => {
    const [selectedTimes, setSelectedTimes] = useState(value);
    // To updated selected time on change in value
    useEffect(() => {
        setSelectedTimes(value);
    }, [value]);
    // Add new time
    const [newTime, setNewTime] = useState("");
    const handleAddTime = () => {
        if (newTime && !selectedTimes.includes(newTime) && !disabledTimes.includes(newTime)) {
            setSelectedTimes([...selectedTimes, newTime]);
            setNewTime(""); // Reset the time input box
            onChange && onChange([...selectedTimes, newTime]);
        }
    };
    // Remove time
    const handleRemoveTime = (index) => {
        const updatedTimes = selectedTimes.filter((_, i) => i !== index);
        setSelectedTimes(updatedTimes);
        onChange && onChange(updatedTimes);
    };
    // 24 Hr to 12 Hr format
    function convertTo12HourFormat(time24) {
        const [hour, minute] = time24.split(":").map(Number);
        const date = new Date(2000, 0, 1, hour, minute);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return (
        <div className="px-2 py-3 w-full rounded-md border border-input bg-background text-sm disabled:cursor-not-allowed disabled:opacity-50">
            <div className="grid grid-cols-1 gap-1 mb-2">
                {selectedTimes?.length > 0 ? selectedTimes.map((time, index) => (
                    <div key={index} className="mb-2 border-l border-s-2 border-foreground px-2 flex gap-2 justify-between items-center">
                        <span>{convertTo12HourFormat(time)}</span>
                        <button type="button" onClick={() => handleRemoveTime(index)} className="ml-2">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )) :
                    <span className="hidden xxs:block text-sm text-muted-foreground">Time is not picked. Pick a time.</span>
                }
            </div>
            <div className="flex gap-2">
                <TimeInput
                    value={newTime}
                    onChange={(time) => setNewTime(time)}
                    disabledTimes={disabledTimes}
                    disabled={disabled}
                />
                {newTime &&
                    <Button onClick={handleAddTime} variant='secondary' size='icon' className='min-w-[2.5rem]' disabled={disabled}>
                        <Plus className='block w-5 h-5' />
                    </Button>
                }
            </div>
        </div>
    );
};

export default MultipleTimeInput;
