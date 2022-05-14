import React, { useEffect, useState, useContext } from "react";
import GameFooter from "./GameFooter";
import Map from "./Map";
import RightClickMenu from "./RightClickMenu";
import { MetaMaskContext } from "../context/MetaMaskContext";
import { LoadingHelper, RandomColor } from "../helpers/Utilities";
import { FetihContract } from "../helpers/Consts";

function Game() {
  const [showRightClickMenu, setShowRightClickMenu] = useState(false);
  const [coordinates, setCoordinates] = useState({ top: 0, left: 0 });
  const [id, setId] = useState(0);
  const { cityOwners } = useContext(MetaMaskContext);
  const [ownerList, setOwnerList] = useState();
  const [ownerColorList, setOwnerColorList] = useState();

  useEffect(() => {
    document.oncontextmenu = (e) => {
      if (e.target.tagName === "path") {
        e.preventDefault();
        setShowRightClickMenu(true);
        setCoordinates({ top: e.clientY + window.scrollY, left: e.clientX });
        setId(parseInt(e.target.id, 10));
      }
    };

    window.addEventListener("click", (e) => {
      if (e.target.getAttribute("id") !== "attack-btn-drp") {
        setShowRightClickMenu(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setShowRightClickMenu(false);
      }
    });

    async function fetchData() {
      LoadingHelper.ShowLoading();
      const owners = await cityOwners();
      const ownerColors = {};
      owners.forEach((e) => {
        if (e !== FetihContract.ADDRESS && !ownerColors.hasOwnProperty(e)) {
          ownerColors[e] = RandomColor();
        }
      });
      console.log("owners", owners);
      console.log("ownerColors", ownerColors);
      setOwnerList(owners);
      setOwnerColorList(ownerColors);
      owners.forEach((f, index) => {
        if (f !== FetihContract.ADDRESS) {
          document
            .getElementById(index + 1)
            .setAttribute("fill", ownerColors[f]);
        }
      });
      LoadingHelper.HideLoading();
    }
    fetchData();
  }, []);

  return (
    <>
      <Map />
      <RightClickMenu
        id={id}
        top={coordinates.top}
        left={coordinates.left}
        show={showRightClickMenu}
      />
      <GameFooter />
    </>
  );
}

export default Game;
