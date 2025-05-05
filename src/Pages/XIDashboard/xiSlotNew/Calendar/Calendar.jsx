import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { parseISO, isSameDay } from 'date-fns';

const Calendar = ({ handleDateChange, selectedDates, blockedXiDates, value, setValue }) => {
    const [dateValue, setDateValue] = useState(new Date());

    // Convert selectedDates and blockedXiDates to Date objects
    const parsedSelectedDates = selectedDates?.map(date => parseISO(date));
    const parsedBlockedXiDates = blockedXiDates?.map(date => parseISO(date));

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StaticDatePicker
                displayStaticWrapperAs="desktop"
                orientation="portrait"
                value={value}
                onChange={(newValue) => {
                    setDateValue(newValue);
                    handleDateChange(newValue);
                }}
                components={{
                    ActionBar: () => null, // Hides the action buttons
                }}
                slotProps={{
                    day: (day) => {
                        const isInSelectedDates = parsedSelectedDates?.some(selectedDate => isSameDay(day?.day, selectedDate));
                        const isInBlockedXiDates = parsedBlockedXiDates?.some(blockedDate => isSameDay(day?.day, blockedDate));

                        let backgroundColor = '';
                        let hoverColor = '';

                        if (isInSelectedDates) {
                            backgroundColor = '#228276'; 
                            hoverColor = '#196b5f'; 
                        } else if (isInBlockedXiDates) {
                            backgroundColor = '#E49792'; 
                            hoverColor = '#b8534c'; 
                        }

                        return {
                            disabled: isInBlockedXiDates, 
                            sx: {
                                backgroundColor: backgroundColor,
                                borderRadius: '50%',
                                color: isInSelectedDates || isInBlockedXiDates ? 'white' : '', 
                                '&:hover': {
                                    backgroundColor: hoverColor,
                                },
                            },
                        };
                    },
                }}
                renderInput={(params) => <TextField {...params} />}
            />
        </LocalizationProvider>
    );
};

export default Calendar;