import React, { useState } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { NeighboringProvinces } from '../helpers/Consts';
import CityDetailModal from './Modals/CityDetailModal';

function RightClickMenu({ id, top, left }) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [cityDetail, setCityDetail] = useState({});

  const onDetailClick = () => {
    fetch(`https://fetih.somee.com/city/cityDetail/${id}`)
      .then(response => {
        if (response.ok) {
          response.json().then(value => setCityDetail({ ...value }));
          setShowDetailModal(true);
        }
        return false;
      });
  };

  const renderAttackButton = () => {
    const neighborCityNames = NeighboringProvinces[id].map(_id => document.getElementById(_id).getAttribute('name'));
    return (
      <DropdownButton as={ButtonGroup} title="Saldır" id="attack-btn-drp">
        {neighborCityNames.map((name, index) => (<Dropdown.Item key={index} eventKey={index}>{name}</Dropdown.Item>))}
      </DropdownButton>
    );
  };

  return (
    <>
      <ButtonGroup
        vertical
        style={{ top, left, position: 'absolute' }}
      >
        <Button onClick={() => onDetailClick()}>Detay</Button>
        {renderAttackButton()}
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
};

export default RightClickMenu;
