import { useDispatch } from "react-redux";
import {
  setPopupOpen,
  setPopupComponentRender,
  setPopupCenterOpen,
  setPopupCenterComponentRender,
  setPopupCenterClosingFunction,
  setPopupCenterClosable,
} from "../Store/slices/popupSlice";

function usePopup() {
  const dispatch = useDispatch();

  const handlePopupOpen = popupOpen => {
    dispatch(setPopupOpen(popupOpen));
  };

  const handlePopupComponentRender = popupComponent => {
    dispatch(setPopupComponentRender(popupComponent));
  };

  const handlePopupCenterOpen = popupCenterOpen => {
    dispatch(setPopupCenterOpen(popupCenterOpen));
    dispatch(setPopupCenterClosable(true));
  };

  const handlePopupCenterComponentRender = popupCenterComponent => {
    dispatch(setPopupCenterComponentRender(popupCenterComponent));
  };

  const handlePopupCenterClosingFunction = popupCenterClosingFunction => {
    dispatch(setPopupCenterClosingFunction(popupCenterClosingFunction));
  };

  return {
    handlePopupOpen,
    handlePopupComponentRender,
    handlePopupCenterOpen,
    handlePopupCenterComponentRender,
    handlePopupCenterClosingFunction,
  };
}

export default usePopup;
