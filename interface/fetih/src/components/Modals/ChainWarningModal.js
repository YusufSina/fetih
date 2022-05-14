import React from 'react';
import Modal from 'react-bootstrap/Modal';

function ChainWarningModal() {
  return (
    <Modal
      show
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header>
        <Modal.Title>Uyarı!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Oyunu oynayabilmek için lütfen
        {' '}
        <b> Rinkeby Test</b>
        {' '}
        ağına bağlanın!
      </Modal.Body>
    </Modal>
  );
}

export default ChainWarningModal;
