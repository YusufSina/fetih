import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import ProgressBar from 'react-bootstrap/ProgressBar';
import PropTypes from 'prop-types';
import { percent } from '../../helpers/Utilities';

function CityDetailModal({ onHide, data }) {
  const [attack, setAttack] = useState(0);
  const [defence, setDefence] = useState(0);

  useEffect(() => {
    setAttack(data.attributes.find(f => f.trait_type === 'attack_power').value);
    setDefence(data.attributes.find(f => f.trait_type === 'defence_power').value);
  }, [data]);

  return (
    <Modal
      show
      onHide={() => onHide()}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Şehir Detayı
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card>
          <Card.Img variant="top" src={data.image} />
          <Card.Body>
            <Card.Title as="h3">{data.name}</Card.Title>
            <Card.Text>
              {data.description}
            </Card.Text>
            <Card.Title as="h4">Özellikler</Card.Title>
            <div className="row">
              <div className="col-md-6">
                <Card.Title as="h6">Saldırı Gücü</Card.Title>
                <Card.Text>
                  <ProgressBar
                    className="progress-transition"
                    variant="danger"
                    now={percent(attack, 10)}
                    label={attack}
                  />
                </Card.Text>
              </div>
              <div className="col-md-6">
                <Card.Title as="h6">Savunma Gücü</Card.Title>
                <Card.Text>
                  <ProgressBar
                    className="progress-transition"
                    variant="info"
                    now={percent(defence, 10)}
                    label={defence}
                  />
                </Card.Text>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
}

CityDetailModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default CityDetailModal;
