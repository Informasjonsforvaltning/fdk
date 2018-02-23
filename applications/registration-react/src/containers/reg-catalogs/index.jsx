import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CardGroup, CardDeck, Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

import {
  fetchCatalogsIfNeeded
} from '../../actions/index';
import FormCatalog from '../../components/reg-form-schema-catalog';
import DatasetItemsList from '../../components/reg-dataset-items-list';
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
      return catalogItems._embedded.catalogs.map((item, index) => (

        <div
          key={item.uri}
          className="col-md-4"
        >

          <Card>
            <Link to={`/react/catalogs/${item.id}`}>
            <CardBody>
              <CardTitle>{item.title.nb}</CardTitle>
              <hr />
              <CardText className="fdk-catalog-text fdk-text-size-small">{item.description.nb}</CardText>
            </CardBody>
            </Link>
          </Card>

        </div>
      ));
    }
    return null;
  }
  render() {
    const {
      isFetchingCatalogs,
      catalogItems
    } = this.props;
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12" />
        </div>
        <div className="row mb-2 mb-md-5">
          <div className="col-md-2" />
          {!isFetchingCatalogs && catalogItems &&
          <div className="col-md-8">

              <CardGroup>
            {this._renderCatalogs()}
            {this._renderCatalogs()}
                {this._renderCatalogs()}
                {this._renderCatalogs()}

              </CardGroup>

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
