import React, { useContext, useState } from "react";
import { Button, Badge } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { MetaMaskContext } from "../context/MetaMaskContext";
import { shortenAccountAddress } from "../helpers/Utilities";

function Title() {
  const { connectMetaMask, account, isMetaMaskInstalled } =
    useContext(MetaMaskContext);
  const [walletModal, setWalletModal] = useState(false);
  const handleClose = () => setWalletModal(false);

  return (
    <div className="jumbotron px-3 title-fetih">
      <div className="d-flex flex-row justify-content-between align-items-center">
        <div className="d-flex flex-row justify-content-around align-items-end">
          <img
            src="/assets/img/Logo.png"
            className="img-fluid"
            style={{ width: "270px", height: "auto" }}
            alt="logo"
          />
        </div>
        <div className="d-flex flex-column justify-content-end align-items-center">
          {account === "" ? (
            <Button
              variant="outline-light"
              onClick={() => setWalletModal(true)}
            >
              Cüzdan Bağla
            </Button>
          ) : (
            <Badge pill bg="dark">
              {shortenAccountAddress(account)}
            </Badge>
          )}
        </div>
        <Modal
          show={walletModal}
          backdrop="static"
          keyboard={false}
          centered
          onHide={() => handleClose()}
        >
          <Modal.Header closeButton>
            <Modal.Title>Cüzdan bağlayın</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <button
              type="button"
              className="btn btn-light col-md-12 mb-2"
              onClick={() => {
                connectMetaMask();
                handleClose();
              }}
            >
              <div className="row">
                <div className="col-md-6">
                  <div color="#E8831D" className="mt-3 float-start">
                    {isMetaMaskInstalled ? (
                      account === "" ? (
                        <b>Metamaskı bağlayın!</b>
                      ) : (
                        <Badge pill bg="dark">
                          {shortenAccountAddress(account)}
                        </Badge>
                      )
                    ) : (
                      <a
                        target="_blank"
                        href="https://metamask.io/"
                        rel="noopener noreferrer"
                        color="#E8831D"
                        className="float-start"
                      >
                        <b>Metamaskı yükleyiniz!</b>
                      </a>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <img
                    src="/assets/img/MetaMask_Fox.png"
                    width="50px"
                    className="img-thumbnail mx-auto float-end"
                    alt="MetamaskIcon"
                  />
                </div>
              </div>
            </button>
            <button
              type="button"
              className="btn btn-light col-md-12  mb-2"
              disabled
            >
              <div className="row">
                <div className="col-md-6">
                  <div color="#E8831D" className="mt-3 float-start">
                    <b>Wallet Connect</b>
                  </div>
                </div>
                <div className="col-md-6">
                  <img
                    src="/assets/img/walletConnect.jpg"
                    width="50px"
                    className="img-thumbnail mx-auto float-end"
                    alt="WalletConnectIcon"
                  />
                </div>
              </div>
            </button>
            <button
              type="button"
              className="btn btn-light col-md-12  mb-2"
              disabled
            >
              <div className="row">
                <div className="col-md-6">
                  <div color="#E8831D" className="mt-3 float-start">
                    <b>Coinbase Wallet</b>
                  </div>
                </div>
                <div className="col-md-6">
                  <img
                    src="/assets/img/coinbaseWallet.png"
                    width="50px"
                    className="img-thumbnail mx-auto float-end"
                    alt="coinbaseWalletIcon"
                  />
                </div>
              </div>
            </button>
            <button
              type="button"
              className="btn btn-light col-md-12  mb-2"
              disabled
            >
              <div className="row">
                <div className="col-md-6">
                  <div color="#E8831D" className="mt-3 float-start">
                    <b>Fortmatic</b>
                  </div>
                </div>
                <div className="col-md-6">
                  <img
                    src="/assets/img/fortmatic.png"
                    width="50px"
                    className="img-thumbnail mx-auto float-end"
                    alt="fortmaticIcon"
                  />
                </div>
              </div>
            </button>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default Title;
