import React, { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Separator } from "./separator";
import { Clock10 } from "lucide-react";
import { Badge } from "./badge";

const generateOptions = (maxValue, labelPrefix = "") =>
  Array.from({ length: maxValue }, (_, i) => {
    const value = i < 10 ? `0${i}` : `${i}`;
    return { value, label: labelPrefix + value };
  });

const hours = generateOptions(24);
const minutes = generateOptions(60);

const TimeInput = ({ onChange, value = '00:00', disabledTimes = [], disabled }) => {
  const [selectedHour, setSelectedHour] = useState(!disabled && value.split(":")[0]);
  const [selectedMinute, setSelectedMinute] = useState(!disabled && value.split(":")[1]);
  const [selectedTime, setSelectedTime] = useState(!disabled && value);

  useEffect(() => {
    if (selectedHour !== undefined && selectedMinute !== undefined) {
      const newTime = `${selectedHour}:${selectedMinute}`;
      setSelectedTime(newTime);
      onChange && onChange(newTime);
    }
  }, [selectedHour, selectedMinute, onChange]);
  // 24 Hr to 12 Hr format
  function convertTo12HourFormat(time24) {
    const [hour, minute] = time24.split(":").map(Number);
    const date = new Date(2000, 0, 1, hour, minute);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="flex items-center border border-input bg-background w-full pr-3 text-left font-normal rounded-md disabled:cursor-not-allowed disabled:opacity-50">
      <Select defaultValue={selectedHour} onValueChange={setSelectedHour} disabled={disabled}>
        <SelectTrigger className="w-[60px] h-full border-t-0 border-x-0 border-b-0 rounded-l-md focus:ring-0 focus:ring-offset-0 focus:border-b-2 focus:border-ring focus:rounded-none">
          <SelectValue placeholder="Hour" />
        </SelectTrigger>
        <SelectContent className='h-[60vh] overflow-auto'>
          {hours.map((hour, index) => (
            <SelectItem key={index} value={hour.value} disabled={disabledTimes.includes(`${hour.value}:${selectedMinute}`)}>
              {hour.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Separator orientation='vertical' className='h-10' />
      <Select defaultValue={selectedMinute} onValueChange={setSelectedMinute} disabled={disabled}>
        <SelectTrigger className="w-[60px] h-full border-t-0 border-x-0 border-b-0 rounded-l-md focus:ring-0 focus:ring-offset-0 focus:border-b-2 focus:border-ring focus:rounded-none">
          <SelectValue placeholder="Min" />
        </SelectTrigger>
        <SelectContent className='h-[60vh] overflow-auto'>
          {minutes.map((minute, index) => (
            <SelectItem key={index} value={minute.value} disabled={disabledTimes.includes(`${selectedHour}:${minute.value}`)}>
              {minute.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedTime ? (
        <Badge variant={'secondary'} className="hidden xxs:block text-sm font-normal ml-2 rounded-md">
          {convertTo12HourFormat(selectedTime)}
        </Badge>
      ) : (
        <span className="hidden xxs:block text-sm ml-2 text-muted-foreground">Pick a time</span>
      )}
      <Clock10 className="ml-auto h-4 w-4 opacity-50" />
    </div>
  );
};

export default TimeInput;
