import styles from './ShowInstructionsPopup.module.css';
import InstructionsImage from "../../../../assets/images/Playground/InstructionsImage.svg"
import { Close } from '@material-ui/icons';

const ShowInstructionsPopup = () => {
    return (
        <div className={"flex p-4 items-center justify-center bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 gap-4 w-[715px]"}>
            {/* <Close className='absolute right-4 top-4 cursor-pointer' /> */}
            <img src={InstructionsImage} alt="InstructionsImage" />
            <div className='flex flex-col gap-2'>
                <h1 className='font-bold'>
                    ValueMatrix is blocked from using your microphone and camera
                </h1>
                <p>
                    Click the
                    address bar
                    page info icon in your browser’s
                    Turn on microphone and camera
                </p>
            </div>
        </div>
    );
};

export default ShowInstructionsPopup;
