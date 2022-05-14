import React from 'react';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';

function CityDetailModal({ onHide, data }) {
  return (
    <Modal
      show
      onHide={() => onHide()}
      dialogClassName="modal-90w"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {data.name}
          {' '}
          Detay
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Ipsum molestiae natus adipisci modi eligendi? Debitis amet quae unde
          commodi aspernatur enim, consectetur. Cumque deleniti temporibus
          ipsam atque a dolores quisquam quisquam adipisci possimus
          laboriosam. Quibusdam facilis doloribus debitis! Sit quasi quod
          accusamus eos quod. Ab quos consequuntur eaque quo rem! Mollitia
          reiciendis porro quo magni incidunt dolore amet atque facilis ipsum
          deleniti rem!
        </p>
      </Modal.Body>
    </Modal>
  );
}

CityDetailModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default CityDetailModal;
