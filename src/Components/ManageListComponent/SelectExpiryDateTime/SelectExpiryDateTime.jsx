
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers';
import Button from '../../Button/Button';

const SelectExpiryDateTime = () => {
    return (
        <div className='bg-white rounded-lg w-[25rem] flex flex-col'>
            <div className='px-3'>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker />
            </LocalizationProvider>
            </div>
            <div className='px-3'>
                time picker
            </div>
            <div className='border-t w-full p-3'>
                <Button text={"Apply"} btnType={'primary'} className={'ml-auto'}/>
            </div>
        </div>
    );
}

export default SelectExpiryDateTime;
