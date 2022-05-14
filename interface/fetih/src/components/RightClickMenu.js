import React, { useState, useContext } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import CityDetailModal from './Modals/CityDetailModal';
import { LoadingHelper } from '../helpers/Utilities';
import { Fetch } from './Fetch';
import { MetaMaskContext } from '../context/MetaMaskContext';

function RightClickMenu({ id, top, left, show, isCityEmpty, attackAbleCities, isCityMine }) {
  const { battle, buyLand, produceSoldiers, claimSoldiers } = useContext(MetaMaskContext);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [cityDetail, setCityDetail] = useState({});

  const onDetailClick = () => {
    LoadingHelper.ShowLoading();
    Fetch(`https://fetih.somee.com/city/cityDetail/${id}`)
      .then(data => {
        setCityDetail({ ...data });
        setShowDetailModal(true);
        LoadingHelper.HideLoading();
      });
  };

  const renderAttackButton = () => {
    const neighborCityNames = attackAbleCities.map(_id => ({ name: document.getElementById(_id).getAttribute('name'), id: _id }));
    return (
      <Dropdown as={ButtonGroup}>
        <Dropdown.Toggle id="attack-btn-drp" className="rightClickContext-btn">Saldır</Dropdown.Toggle>
        <Dropdown.Menu>
          {neighborCityNames.map((city, index) => (<Dropdown.Item key={index} eventKey={index} onClick={async () => { await battle(id, city.id); }}>{city.name}</Dropdown.Item>))}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  if (id === 0) {
    return null;
  }

  return (
    <>
      <ButtonGroup
        vertical
        style={{ top, left, position: 'absolute', display: show ? 'block' : 'none' }}
      >
        <Button className="rightClickContext-btn" onClick={() => onDetailClick()}>Detay</Button>
        {isCityEmpty && <Button className="rightClickContext-btn" onClick={() => buyLand(id)}>Satın Al</Button>}
        {isCityMine && <Button className="rightClickContext-btn" onClick={() => produceSoldiers(id)}>Asker Üret</Button>}
        {isCityMine && <Button className="rightClickContext-btn" onClick={() => claimSoldiers(id)}>Askerleri Topla</Button>}
        {isCityMine && renderAttackButton()}
      </ButtonGroup>
      {
        showDetailModal && (
          <CityDetailModal
            onHide={() => { setShowDetailModal(false); setCityDetail({}); }}
            data={cityDetail}
          />
        )
      }
    </>
  );
}

RightClickMenu.propTypes = {
  id: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  show: PropTypes.bool.isRequired,
  isCityEmpty: PropTypes.bool.isRequired,
  attackAbleCities: PropTypes.arrayOf(PropTypes.number).isRequired,
  isCityMine: PropTypes.bool.isRequired,
};

export default RightClickMenu;
