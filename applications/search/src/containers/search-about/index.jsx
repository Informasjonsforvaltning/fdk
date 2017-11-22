import React from 'react';
import DocumentMeta from 'react-document-meta';

import localization from '../../components/localization';

const About = () => {
  const meta = {
    title: `Om ${localization.about.title}`,
    description: localization.about.ingress
  };
  return (
    <div className="container">
      <DocumentMeta {...meta} />
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
            <a href="/about-registration" title="Link">Hjelp til å komme i gang med å registrere datasett</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
