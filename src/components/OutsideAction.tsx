import React, { useEffect, useRef } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 */
const useOutsideAction = (ref: any, action: Function) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        action();
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [action, ref]);
};

/**
 * Component that alerts if you click outside of it
 */
const OutsideAction = ({ action, children }: any) => {
  const wrapperRef = useRef(null);
  useOutsideAction(wrapperRef, action);

  return <div ref={wrapperRef}>{children}</div>;
};

export default OutsideAction;
