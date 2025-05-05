import { Close } from '@mui/icons-material';
import Button from '../../../../Button/Button';
import CustomInput from '../../../../CustomInput/CustomInput';
import usePopup from '../../../../../Hooks/usePopup';
import { useEffect, useState } from 'react';
import useList from '../../../../../Hooks/useList';
import { notify } from '../../../../../utils/notify';
import { useSelector } from 'react-redux';


const ListNamePopup = ({ selectedCandidatesForList, list, jobId, setIsPopoverVisible, isPopoverVisible, uncheckBoxes }) => {

    const [listName, setListName] = useState();
    const { handlePopupCenterOpen } = usePopup()
    const { handleCreateList, handleRenameList } = useList();
    const { createListData } = useSelector(state => state.list);

    const handleClosePopup = () => {
        if (list?._id) {
            setIsPopoverVisible(!isPopoverVisible)
        }

        handlePopupCenterOpen(false)
    }


    const onChange = (e) => {
        e.preventDefault();
        setListName(e.target.value);
    }

    const createList = async () => {
        if (!list?._id) {
            const listData = selectedCandidatesForList?.map((item) => (
                {
                    "firstName": item?.firstName,
                    "lastName": item?.lastName,
                    "email": item?.email,
                    "linkedinUrl": item?.linkedinUrl,
                    "contact": item?.phoneNo,
                    "profileImg": item?.userImage,
                }
            ));

            if (listName.length > 20) {
                notify("List name length cannot be more than 20", "error");
                return;
            }
            const data = {
                "listName": listName,
                "jobId": selectedCandidatesForList[0]?.job_id,
                "listData": listData
            }
            await handleCreateList(data);
            setListName("");
            handleClosePopup();
            uncheckBoxes("uncheckAllBoxes");
        }
        else {
            // console.log("aaaaaaaauuuuuuuuuuu7777", listName, "ss")
            if (!listName || listName === undefined || listName === null) {
                notify("List name cannot be empty", "error");
                return;
            }
            const data = {
                "listName": listName,
                "listId": list?._id
            }
            await handleRenameList(data, jobId);
            setListName("");
            handleClosePopup();

        }
    }

    useEffect(() => {
    }, [createListData]);

    return (
        <div className={`w-[30rem] p-3 rounded-lg flex flex-col gap-4 bg-white`}>
            <div className='flex justify-between'>
                <h2 className='font-semibold'>Enter list name</h2>
                <Close onClick={handleClosePopup} className='cursor-pointer' />
            </div>
            <div>
                <CustomInput onChange={onChange} />
            </div>
            <div className='flex gap-4 ml-auto'>
                <Button text={'Cancel'} btnType={'secondary'} onClick={handleClosePopup} />
                <Button text={list?._id ? "Rename list" : 'Create list'} btnType={'primary'} onClick={createList} />
            </div>
        </div>
    );
};

export default ListNamePopup;