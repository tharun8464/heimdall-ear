import { useRef, useEffect } from 'react';
import Styles from './PopUpCenter.module.css';
import Button from '../Button/Button';

function PopUpCenter({
  ContentComp,
  isOpen,
  closeFun,
  isClosable = true,
  withBorder = false,
}) {
  const primaryWrapperRef = useRef(null);
  const timeOutRef = useRef(null);

  useEffect(() => {
    if (primaryWrapperRef?.current?.style) {
      if (isOpen) {
        primaryWrapperRef.current.style.display = 'flex';
        clearTimeout(timeOutRef.current);
        timeOutRef.current = setTimeout(() => {
          if (primaryWrapperRef?.current) {
            primaryWrapperRef.current.style.opacity = 1;
            primaryWrapperRef.current.style.pointerEvents = 'all';

            primaryWrapperRef.current.childNodes[0].style.transform =
              'scale(1)';
            primaryWrapperRef.current.childNodes[0].style.opacity = 1;
          }
        }, 1);
      } else {
        if (primaryWrapperRef?.current) {
          primaryWrapperRef.current.style.opacity = 0;
          primaryWrapperRef.current.childNodes[0].style.transform =
            'scale(0.7)';
          primaryWrapperRef.current.childNodes[0].style.opacity = 0.5;
        }

        clearTimeout(timeOutRef.current);
        timeOutRef.current = setTimeout(() => {
          if (primaryWrapperRef?.current) {
            primaryWrapperRef.current.style.display = 'none';
            primaryWrapperRef.current.style.pointerEvents = 'none';
          }
        }, 250);
      }
    }
  }, [isOpen]);

  function handleKeyDowns(e) {
    if (isOpen) {
      if (e.key == 'Escape') {
        if (isClosable && closeFun) {
          closeFun();
        }
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDowns);

    return () => {
      document.removeEventListener('keydown', handleKeyDowns);
    };
  }, [isOpen, isClosable]);

  return (
    <div
      className={Styles.Wrapper}
      ref={primaryWrapperRef}
      onClick={(e) => {
        if (isClosable && e.target === primaryWrapperRef.current && closeFun) {
          closeFun();
        }
      }}>

      <div
        className={Styles.Container}
        style={withBorder ? {} : { border: 'none' }}>
        {ContentComp ? ContentComp : null}
      </div>
    </div>
  );
}

export default PopUpCenter;
