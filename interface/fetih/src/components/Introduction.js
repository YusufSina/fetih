import React from 'react';
import { Container } from 'react-bootstrap';

function Introduction() {
  return (
    <>
      <img src="/assets/img/slider.png" className="w-100" alt="slider" />
      <div
        className="h-100 w-100 d-flex flex-row justify-content-center align-items-center"
      >
        <Container>
          <div className="d-flex flex-column justify-content-center align-items-center">

            <div className="row py-5">
              <div className="col-md-6">
                <br />
                <br />
                <br />
                <br />
                <br />
                <h2>Fetih Nedir?</h2>
                <p className="fs-4">&emsp;Yeni topraklar fethetmeyi, şans ve savaş stratejinizi deneyimi yaşamak istiyorsanız, Fetih: aradığınız uzun soluklu oyun olabilir. Artık ülkenizi korumak ve geliştirmek tamamen sizin elinizde olacak. Soluksuz bir maceraya başlayacaksınız. Yeni topraklar fethederek, şehirlerin komutası siz olacaksınız!</p>
              </div>
              <div className="col-md-6">
                <img src="/assets/img/fighter1.png" className="mx-auto" alt="fighter1" />
              </div>
            </div>

            <div className="row py-5">
              <div className="col-md-6">
                <img src="/assets/img/fighter2.png" className="mx-auto" alt="fighter2" />
              </div>
              <div className="col-md-6">
                <br /> <br /><br /><br /><br /> <br />
                <br />
                <h2>Fetih Nedir?</h2>
                <p className="fs-4" style={{ textAlign: 'right' }}>Artık krallığınızı korumak ve geliştirmek tamamen sizin elinizde. Şehrin üç tane özelliği var;
                  Saldırı Gücü, Savunma Gücü ve Asker Sayısı. Şehrin özelliklerine göre saldırı stratejisi önem kazanmaktadır. Asker sayısı oyundaki en önemli faktördür. Aktif olarak asker sayınızı artırırsanız oyunu kazanma ihtimaliniz oldukça artacaktır. Yeni topraklar fethedecek, kıyasıya geçen harplerde nasıl bir kumandan olduğunuzu kanıtlama fırsatına sahip olacaksınız.</p>
              </div>
            </div>

            <div className="row py-5">
              <div className="col-md-6">
                <br /> <br /><br /><br /><br /> <br />
                <h2>Fetih Nedir?</h2>
                <p className="fs-4">&emsp;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              </div>
              <div className="col-md-6">
                <img src="/assets/img/fighter3.png" className="mx-auto" alt="fighter3" />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Introduction;
