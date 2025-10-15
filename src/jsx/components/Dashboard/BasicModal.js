import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Button } from "react-bootstrap";

const BasicModal = forwardRef(({ children, title }, ref) => {
  const [show, setShow] = useState(false);

  useImperativeHandle(ref, () => ({
    openModal: () => setShow(true),
    closeModal: () => setShow(false),
  }));

  return (
    <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{title || "Ajouter un élément"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default BasicModal;
