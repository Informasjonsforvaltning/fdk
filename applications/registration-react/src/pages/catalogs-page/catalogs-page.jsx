import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CardGroup } from 'reactstrap';

import localization from '../../utils/localization';
import { fetchCatalogsIfNeeded } from '../../actions/index';
import CatalogItem from '../../components/reg-catalogs-item';
import './catalogs-page.scss';

export class RegCatalogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    const catalogsURL = '/catalogs';
    this.props.dispatch(fetchCatalogsIfNeeded(catalogsURL));
  }

  _renderCatalogs() {
    const { catalogItems } = this.props;

    if (
      catalogItems &&
      catalogItems._embedded &&
      catalogItems._embedded.catalogs
    ) {
      return catalogItems._embedded.catalogs.map(item => (
        <CatalogItem key={item.uri} item={item} />
      ));
    }
    return null;
  }
  render() {
    const { isFetchingCatalogs, catalogItems } = this.props;
    return (
      <div className="container">
        <div className="row">
          <div />
        </div>
        <div className="row mb-2 mb-md-5">
          {!isFetchingCatalogs &&
            catalogItems && (
              <div className="col-12">
                <div>
                  <h1 className="fdk-text-strong mb-4">
                    {localization.catalogs.title}
                  </h1>
                </div>
                <CardGroup>{this._renderCatalogs()}</CardGroup>
              </div>
            )}
          {!isFetchingCatalogs &&
            !catalogItems && (
              <div id="no-catalogs">
                <h1 className="fdk-text-strong">
                  {localization.catalogs.missingCatalogs.title}
                </h1>
                <div className="mt-2 mb-2">
                  {localization.catalogs.missingCatalogs.ingress}
                </div>
                <div className="fdk-text-size-small">
                  <strong>
                    {localization.catalogs.missingCatalogs.accessTitle}
                  </strong>
                  <p>{localization.catalogs.missingCatalogs.accessText}</p>
                  <strong>
                    {localization.catalogs.missingCatalogs.assignAccessTitle}
                  </strong>
                  <p>
                    {localization.catalogs.missingCatalogs.assignAccessText}
                  </p>
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }
}

RegCatalogs.defaultProps = {
  catalogItems: null,
  isFetchingCatalogs: false
};

RegCatalogs.propTypes = {
  dispatch: PropTypes.func.isRequired,
  catalogItems: PropTypes.object,
  isFetchingCatalogs: PropTypes.bool
};

function mapStateToProps({ catalogs }) {
  const { catalogItems, isFetchingCatalogs } = catalogs || {
    catalogItems: null
  };

  return {
    catalogItems,
    isFetchingCatalogs
  };
}

export default connect(mapStateToProps)(RegCatalogs);
