import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CardGroup, Card, CardText, CardBody, CardTitle } from 'reactstrap';
import { Link } from 'react-router-dom';

import localization from '../../utils/localization';
import {
  fetchCatalogsIfNeeded
} from '../../actions/index';
import './index.scss';

class RegCatalogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    const catalogsURL = '/catalogs';
    this.props.dispatch(fetchCatalogsIfNeeded(catalogsURL));
  }

  _renderCatalogs() {
    const { catalogItems } = this.props;

    if (catalogItems && catalogItems._embedded && catalogItems._embedded.catalogs) {
      return catalogItems._embedded.catalogs.map(item => (

        <div
          key={item.uri}
          className="col-md-4 pl-0"
        >
          <Link className="card-link" to={`/react/catalogs/${item.id}`}>
            <Card>
              <CardBody>
                <CardTitle>{item.title.nb}</CardTitle>
                <hr />
                <CardText className="fdk-catalog-text fdk-text-size-small fdk-color1">{item.description.nb}</CardText>
              </CardBody>

            </Card>
          </Link>
        </div>
      ));
    } return null;
  }
  render() {
    const {
      isFetchingCatalogs,
      catalogItems
    } = this.props;
    return (
      <div className="container-fluid">
        <div className="row">
          <div />
        </div>
        <div className="row mb-2 mb-md-5">
          <div className="col-md-2" />
          {!isFetchingCatalogs && catalogItems &&
          <div className="col-md-8">
            <div>
              <h1 className="fdk-text-strong mb-4">Dine kataloger</h1>
            </div>
            <CardGroup>
              {this._renderCatalogs()}
            </CardGroup>
          </div>
          }
          {!isFetchingCatalogs && !catalogItems &&
          <div>
            <h1 className="fdk-text-strong">{localization.catalogs.missingCatalogs.title}</h1>
            <div className="mt-2 mb-2">
              {localization.catalogs.missingCatalogs.ingress}
            </div>
            <div className="fdk-text-size-small">
              <strong>{localization.catalogs.missingCatalogs.accessTitle}</strong>
              <p>
                {localization.catalogs.missingCatalogs.accessText}
              </p>
              <strong>{localization.catalogs.missingCatalogs.assignAccessTitle}</strong>
              <p>
                {localization.catalogs.missingCatalogs.assignAccessText}
              </p>
            </div>
          </div>
          }
        </div>
      </div>
    )
  }
}

RegCatalogs.defaultProps = {

};

RegCatalogs.propTypes = {
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps({ catalogs }) {

  const { catalogItems, isFetchingCatalogs } = catalogs || {
    catalogItems: null
  }

  return {
    catalogItems,
    isFetchingCatalogs
  }
}

export default connect(mapStateToProps)(RegCatalogs);
