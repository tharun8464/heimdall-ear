import { Close } from '@mui/icons-material';
import Button from '../../../../Button/Button';
import usePopup from '../../../../../Hooks/usePopup';
import { useEffect, useState } from 'react';
import useList from '../../../../../Hooks/useList';
import { useSelector } from 'react-redux';

const DeleteListPopup = ({ jobId, listId }) => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const { handlePopupCenterOpen } = usePopup();
  const { handleRemoveList } = useList();
  const { createListData } = useSelector(state => state.list);

  const handleClosePopup = () => {
    if (listId) {
      setIsPopoverVisible(!isPopoverVisible)
    }
    handlePopupCenterOpen(false)
  }

  const deleteList = async () => {
    const data = {
      "jobId": jobId,
      "listId": listId
    }
    await handleRemoveList(data);
    handleClosePopup();
  }

  useEffect(() => {
  }, [createListData]);

  return (
    <div className={`w-[30rem] p-3 rounded-lg flex flex-col gap-4 bg-white`}>
      <div className='flex justify-between'>
        <h2 className='font-semibold'>Delete list</h2>
        <Close onClick={handleClosePopup} className='cursor-pointer' />
      </div>
      <div className='flex gap-4 ml-auto'>
        <Button text={'Cancel'} btnType={'secondary'} onClick={handleClosePopup} />
        <Button text={"Delete"} btnType={'primary'} onClick={deleteList} />
      </div>
    </div>
  );

}

export default DeleteListPopup;