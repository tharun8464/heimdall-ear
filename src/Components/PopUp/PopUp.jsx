import { useRef, useEffect } from 'react';
import Styles from './PopUp.module.css';
import { Close } from '@mui/icons-material';

function PopUp({ ContentComp, isOpen, closeFun, isClosable = true }) {
  const primaryWrapperRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDowns);
    return () => {
      document.removeEventListener('keydown', handleKeyDowns);
    };
  }, [isOpen, isClosable]);

  function handleKeyDowns(e) {
    if (isOpen) {
      if (e.key === 'Escape') {
        if (isClosable && closeFun) {
          closeFun();
        }
      }
    }
  }

  const handleBgOnClick = (e) => {
    if (overlayRef.current === e.target) {
      if (isClosable && closeFun) {
        closeFun();
      }
    }
  };

  return (
    <div
      ref={overlayRef}
      className={Styles.WrapperWrapper}
      onClick={handleBgOnClick}
      style={{
        background: isOpen ? 'rgba(0, 0, 0, 0.4)' : 'none',
        pointerEvents: isOpen ? 'all' : 'none',
      }}>
      <div
        className={Styles.Wrapper}
        ref={primaryWrapperRef}
        onClick={(e) => {
          if (
            isClosable &&
            e.target === primaryWrapperRef.current &&
            closeFun
          ) {
            closeFun();
          }
        }}
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}>
        {isClosable ? (
          <Close className={Styles.CloseIcon} onClick={closeFun} />
        ) : null}
        {ContentComp ? ContentComp : null}
      </div>
    </div>
  );
}

export default PopUp;
