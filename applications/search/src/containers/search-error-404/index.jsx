import React from 'react';
import './index.scss';

const Error404 = () => (
  <div className="container error-container">
    <div className="error mt-60 text-center">
      <h1>404</h1>
      <p className="lead">
          Oi, dette er flaut! Det ser ut til at vi har rotet det til for deg...<br />
          Gå <a href="/">tilbake til forsiden</a>.
      </p>
    </div>
  </div>
)

export default Error404;
