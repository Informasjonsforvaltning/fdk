import React from 'react';

import localization from '../../components/localization';

const About = () => (
  <div className="container">
    <div className="row">
      <div className="col-md-8 col-md-offset-2">
        <h1 className="fdk-margin-bottom">
          {localization.about.title}
        </h1>
        <div className="fdk-margin-bottom">
          <p className="fdk-ingress">
            {localization.about.titleSub}
          </p>
          <p className="fdk-ingress">
            {localization.about.ingress}
          </p>
        </div>
        <div className="fdk-textregular">
          {
            // eslint-disable-next-line react/no-danger
          }<p dangerouslySetInnerHTML={{__html: localization.about.maintext}} />
        </div>
      </div>
    </div>
  </div>
)

export default About;
