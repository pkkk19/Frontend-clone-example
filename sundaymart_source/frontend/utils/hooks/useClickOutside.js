import React, { useRef, useEffect } from "react";

function useOutsideAlerter({ ref, setVisible, visible }) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        if (!visible) setVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

export default function OutsideAlerter(props) {
  const ref = useRef(null);
  useOutsideAlerter({
    ref,
    setVisible: props.setVisible,
    visible: props.visible,
  });

  return (
    <div className={props.className} ref={ref}>
      {props.children}
    </div>
  );
}
