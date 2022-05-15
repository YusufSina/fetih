import React from 'react';
import { Container } from 'react-bootstrap';

function Introduction() {
  return (
    <>
      <img src="/assets/img/slider.png" className="w-100" alt="slider" />
      <div className="h-100 w-100 d-flex flex-row justify-content-center align-items-center">
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
                <p className="fs-4">
                &emsp;Yeni topraklar fethetmeyi, şans ve savaş stratejinizi
                  deneyimi yaşamak istiyorsanız, Fetih: aradığınız uzun soluklu
                  oyun olabilir. Artık ülkenizi korumak ve geliştirmek tamamen
                  sizin elinizde olacak. Soluksuz bir maceraya başlayacaksınız.
                  Yeni topraklar fethederek, şehirlerin komutası siz
                  olacaksınız!
                </p>
              </div>
              <div className="col-md-6">
                <img
                  src="/assets/img/fighter1.png"
                  className="mx-auto"
                  alt="fighter1"
                />
              </div>
            </div>

            <div className="row py-5">
              <div className="col-md-6">
                <img
                  src="/assets/img/fighter2.png"
                  className="mx-auto"
                  alt="fighter2"
                />
              </div>
              <div className="col-md-6">
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <h2>Oyun Stratejisi</h2>
                <p className="fs-4" style={{ textAlign: 'right' }}>
                  Artık krallığınızı korumak ve geliştirmek tamamen sizin
                  elinizde. Şehrin üç tane özelliği var; Saldırı Gücü, Savunma
                  Gücü ve Asker Sayısı. Şehrin özelliklerine göre saldırı
                  stratejisi önem kazanmaktadır. Asker sayısı oyundaki en önemli
                  faktördür. Aktif olarak asker sayınızı artırırsanız oyunu
                  kazanma ihtimaliniz oldukça artacaktır. Yeni topraklar
                  fethedecek, kıyasıya geçen harplerde nasıl bir kumandan
                  olduğunuzu kanıtlama fırsatına sahip olacaksınız.
                </p>
              </div>
            </div>

            <div className="row py-5">
              <div className="col-md-6">
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <h2>Kazanç Modeli</h2>
                <p className="fs-4">
                &emsp;Bir haritadaki tüm bölgeleri fetheden kullanıcı oyun
                  hazinesindeki tüm değerin %90’nını hakeder.
                </p>
              </div>
              <div className="col-md-6">
                <img
                  src="/assets/img/fighter3.png"
                  className="mx-auto"
                  alt="fighter3"
                />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Introduction;
