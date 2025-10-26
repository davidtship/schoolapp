import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, Button } from "react-bootstrap";
import "./BasicModal.css"; // <-- On va définir la taille ici

const BasicModal = forwardRef(({ title, children }, ref) => {
  const [show, setShow] = useState(false);

  useImperativeHandle(ref, () => ({
    openModal: () => setShow(true),
    closeModal: () => setShow(false),
  }));

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      centered
      dialogClassName="custom-modal-width horizontal-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold text-primary">
          {title || "Ajouter un élément"}
        </Modal.Title>
      </Modal.Header>

      {/* Corps horizontal */}
      <Modal.Body className="d-flex flex-row align-items-start gap-4 p-4">
        {children}
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-end">
        <Button variant="secondary" onClick={() => setShow(false)}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default BasicModal;
