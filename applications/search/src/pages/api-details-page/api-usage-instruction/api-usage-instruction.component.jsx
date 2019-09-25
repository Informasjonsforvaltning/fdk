import React from 'react';
import PropTypes from 'prop-types';

import localization from '../../../lib/localization';

import { ListRegular } from '../../../components/list-regular/list-regular.component';
import { TwoColRow } from '../../../components/list-regular/twoColRow/twoColRow';

export default function ApiServer({ servers, apiSpecUrl, apiDocUrl }) {
  const renderLinks = () =>
    (apiSpecUrl || apiDocUrl) && (
      <div className="d-flex list-regular--item">
        <div className="col-12 pl-0">
          {apiDocUrl && (
            <a href={apiDocUrl} className="mr-5">
              {localization.documentation}
              <i className="fa fa-external-link fdk-fa-right" />
            </a>
          )}
          {apiSpecUrl && (
            <a href={apiSpecUrl} className="mr-5">
              {localization.specification}
              <i className="fa fa-external-link fdk-fa-right" />
            </a>
          )}
        </div>
      </div>
    );

  return (
    <ListRegular title={localization.api.servers.title}>
      <div className="d-flex list-regular--item">
        <div className="col-7 pl-0">
          <h4 className="">{localization.api.servers.url}</h4>
        </div>
        <div className="col-5">
          <h4 className="">{localization.api.servers.description}</h4>
        </div>
      </div>
      {servers.map(({ url, description }) => (
        <TwoColRow
          key={`${url}${description}`}
          col1={url}
          col2={description}
          col1Width={7}
          col2Width={5}
        />
      ))}
      {renderLinks()}
    </ListRegular>
  );
}

ApiServer.defaultProps = {
  servers: [],
  apiSpecUrl: null,
  apiDocUrl: null
};

ApiServer.propTypes = {
  servers: PropTypes.array,
  apiSpecUrl: PropTypes.string,
  apiDocUrl: PropTypes.string
};
