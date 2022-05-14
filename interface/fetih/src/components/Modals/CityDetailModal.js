import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Badge from 'react-bootstrap/Badge';
import PropTypes from 'prop-types';
import { percent } from '../../helpers/Utilities';
import { MetaMaskContext } from '../../context/MetaMaskContext';

function CityDetailModal({ onHide, data }) {
  const { isTheBarrackBusy, getSoldierNumberByCityId } = useContext(MetaMaskContext);

  const [attack, setAttack] = useState(0);
  const [defence, setDefence] = useState(0);
  const [isBarrackBusy, setIsBarrackBusy] = useState(false);
  const [soldierNumber, setSoldierNumber] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const barrackState = await isTheBarrackBusy(data.id);
      setIsBarrackBusy(barrackState);
      const soldierNumberState = await getSoldierNumberByCityId(data.id);
      setSoldierNumber(soldierNumberState);
    }
    fetchData();
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
            <Card.Title as="h3">{data.name} #{data.id} </Card.Title>
            <Card.Text>
              {data.description}
            </Card.Text>
            <Card.Title as="h4">Özellikler</Card.Title>
            <div className="row">
              <div className="col-md-6">
                <Card.Title as="h6">Saldırı Gücü</Card.Title>
                <ProgressBar
                  className="progress-transition"
                  variant="danger"
                  now={percent(attack, 10)}
                  label={attack}
                />
              </div>
              <div className="col-md-6">
                <Card.Title as="h6">Savunma Gücü</Card.Title>
                <ProgressBar
                  className="progress-transition"
                  variant="info"
                  now={percent(defence, 10)}
                  label={defence}
                />
              </div>
            </div>
            <div className="row pt-3">
              <div className="col-md-6">
                <Card.Title as="h6">Kışla Durumu</Card.Title>
                <Card.Text>
                  {
                    isBarrackBusy ?
                      (
                        <>
                          <Badge pill bg="success">
                            Eğitim Devam Ediyor
                          </Badge>
                          <br/>
                          <span>Kışla sorumlusu eğitilecek askerleri olduğu için çok mutlu!!</span>
                        </>
                      ) :
                      (
                        <>
                          <Badge pill bg="warning">
                            Kışla Boş
                          </Badge>
                          <br/>
                          <span>Kışla sorumlusu son zamanlarda öğrencilerinin az olmasından yakınıyor!</span>
                        </>
                      )
                  }
                </Card.Text>
              </div>
              <div className="col-md-6">
                <Card.Title as="h6">Asker Sayısı</Card.Title>
                <Card.Text>
                  {soldierNumber}
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
