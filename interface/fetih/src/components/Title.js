import React from 'react';

function Title() {
  return (
    <div className="jumbotron pt-4 pb-3 px-3" style={{ backgroundColor: '#878787' }}>
      <div className="d-flex flex-row justify-content-between align-items-center">
        <div className="d-flex flex-row justify-content-around align-items-end">
          <img src="https://picsum.photos/50" className="img-thumbnail px-2 mb-0" alt="logo" />
          <h1 className="px-2 mb-0">FETİH</h1>
          <p className="px-2 mb-0">Ele geçir ve kazan!</p>
        </div>
        <div className="d-flex flex-column justify-content-end align-items-center">
          <button type="button" className="btn btn-primary">Cüzdan Bağla</button>
        </div>
      </div>
      <div className="container text-center">
        <div className="d-flex justify-content-center align-items-center" />
      </div>
    </div>
  );
}

export default Title;
