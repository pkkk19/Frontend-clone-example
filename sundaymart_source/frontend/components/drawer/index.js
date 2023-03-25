import React from "react";
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap";
import useWindowSize from "../../hooks/useWindowSize";

function Drawer({
  title = "Drawer name",
  visible,
  setVisible,
  children,
  direction,
  className,
}) {
  const onClose = () => {
    setVisible(false);
  };
  const windowSize = useWindowSize();
  direction = windowSize.width > 768 ? "end" : "bottom";
  return (
    <Offcanvas
      width={485}
      direction={direction}
      toggle={onClose}
      isOpen={visible}
      backdropTransition={{
        mountOnEnter: true,
        timeout: 10,
      }}
      offcanvasTransition={{ timeout: 10 }}
      className={className}
    >
      <OffcanvasHeader toggle={onClose}>{title}</OffcanvasHeader>
      <OffcanvasBody className={className}>{children}</OffcanvasBody>
    </Offcanvas>
  );
}

export default Drawer;
