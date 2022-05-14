import React, { useState } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { NeighboringProvinces } from '../helpers/Consts';
import CityDetailModal from './Modals/CityDetailModal';
import { LoadingHelper } from '../helpers/Utilities';
import { Fetch } from './Fetch';

function RightClickMenu({ id, top, left, show }) {
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
    const neighborCityNames = NeighboringProvinces[id].map(_id => document.getElementById(_id).getAttribute('name'));
    return (
      <DropdownButton as={ButtonGroup} title="Saldır" id="attack-btn-drp">
        {neighborCityNames.map((name, index) => (<Dropdown.Item key={index} eventKey={index}>{name}</Dropdown.Item>))}
      </DropdownButton>
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
  show: PropTypes.bool.isRequired,
};

export default RightClickMenu;
