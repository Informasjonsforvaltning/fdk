import React from 'react';
import DocumentMeta from 'react-document-meta';
import { Link } from 'react-router-dom';

import localization from '../../lib/localization';

export const AboutPage = () => {
  const meta = {
    title: `Om ${localization.about.title}`,
    description: localization.about.ingress
  };
  return (
    <div className="container">
      <DocumentMeta {...meta} />
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <h1 className="title">{localization.about.title}</h1>
          <div className="mb-2">
            <p className="fdk-ingress">{localization.about.titleSub}</p>
            <p className="fdk-ingress">{localization.about.ingress}</p>
          </div>
          <div className="fdk-textregular">
            <p
              dangerouslySetInnerHTML={{ __html: localization.about.maintext }}
            />
            <p
              dangerouslySetInnerHTML={{
                __html: localization.about.dataNorgeText
              }}
            />
            <p>
              <b>{localization.about.register}</b>
              <br />
              <Link to="/about-registration">
                {localization.about.helpToRegister}
              </Link>
            </p>
            <p>
              <a
                title="Lenke til registreringsløsning"
                target="_blank"
                rel="noopener noreferrer"
                href="https://registrering.fellesdatakatalog.brreg.no/"
              >
                <span className="fdk-button fdk-button-default">
                  Kom i gang med registreringen
                </span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
