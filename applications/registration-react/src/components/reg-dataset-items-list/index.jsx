import React from 'react';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import axios from 'axios';

import localization from '../../utils/localization';
import DatasetItemsListItem from '../reg-dataset-items-list-item';
import ImportModal from '../app-import-modal';
import './index.scss';

class DatasetItemsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortField: 'title',
      sortType: 'asc',
      showImportModal: false
    };
    this.onSortField = this.onSortField.bind(this);
    this.toggleImportModal = this.toggleImportModal.bind(this);
    this.handleCreateDataset = this.handleCreateDataset.bind(this);
    this.handleImportDataset = this.handleImportDataset.bind(this);
  }

  onSortField(field, type) {
    this.setState({
      sortField: field,
      sortType: type
    });
  }

  toggleImportModal() {
    this.setState({ showImportModal: !this.state.showImportModal });
  }

  handleCreateDataset() {
    const catalogURL = window.location.pathname;
    const datasetPath = 'datasets/';

    const api = {
      Authorization: `Basic user:password`
    };

    return axios.post(
      `${catalogURL}/${datasetPath}`, {headers: api}
    ).then((response) => {
      console.log(response);
    }).catch((error) => {
      throw {error}
    });
  }

  handleImportDataset(url) {
    this.setState({
      showImportModal: false
    });
    /*
     this.service.import(this.catalog, this.import.datasetImportUrl).then(() => {
     modal.hide();
     this.import.importLoading = false;
     this.getAllDatasets();

     }).catch((error) => {
     this.import.importLoading = false;
     this.import.importErrorMessage = "Ukjent feil";
     try {
     this.import.importErrorMessage = JSON.parse(error._body).message;
     } catch (error) {
     console.error(error);
     }
     });


     import(catalog: Catalog, url: string) : Promise<Catalog> {
     const postUrl = `${this.catalogsUrl}/${catalog.id}/import`;

     let authorization : string = localStorage.getItem("authorization");
     this.headers.append("Authorization", "Basic " + authorization);

     return this.http
     .post(postUrl, url, {headers: this.headers})
     .toPromise()
     .then(() => catalog);

     }
     */
  }

  _renderDatasetItems() {
    let {datasetItems: {_embedded: {datasets}}} = this.props;
    if (datasets) {
      if (this.state.sortField === 'title') {
        datasets = orderBy(datasets, 'title.nb', [this.state.sortType]);
      } else if (this.state.sortField === 'registrationStatus') {
        datasets = orderBy(datasets, 'title.nb', [this.state.sortType]);
      }

      return datasets.map(item => (
        <DatasetItemsListItem
          key={item.id}
          item={item}
        />
      ));
    }
    return (
      <div className="fdk-datasets-list-item d-flex">
        <span className="fdk-text-size-small fdk-color2">{localization.datasets.list.missingItems}</span>
      </div>
    );

  }


  render() {
    return (
      <div>
        <div className="d-flex mb-3">
          <button className="fdk-button fdk-button-cta" onClick={this.handleCreateDataset}>
            <i className="fa fa-plus fdk-color0 mr-2" />
            {localization.datasets.list.btnNewDataset}
          </button>
          <button
            className="ml-2 transparentButton"
            onClick={this.toggleImportModal}
          >
            <i className="fa fa-plus fdk-color1 mr-2" />
            {localization.datasets.list.btnImportDataset}
          </button>
        </div>

        <div className="fdk-datasets-list-header d-flex">
          <div className="d-flex align-items-center w-75">
            <span className="header-item mr-1">
              {localization.datasets.list.header.title}
            </span>
            <div className="d-flex">
              <button
                name="titleAsc"
                className="sortButton transparentButton"
                onClick={() => this.onSortField('title', 'asc')}
                title="Stigende"
              >
                {this.state.sortField === 'title' && this.state.sortType === 'asc' &&
                <i className="fa fa-sort-up fdk-color0" />
                }
                {(this.state.sortField !== 'title' || this.state.sortType !== 'asc') &&
                <i className="fa fa-sort-up fdk-color0" />
                }
              </button>

              <button
                name="titleDesc"
                className="sortButton transparentButton"
                onClick={() => this.onSortField('title', 'desc')}
                title="Synkende"
              >
                {this.state.sortField === 'title' && this.state.sortType === 'desc' &&
                <i className="fa fa-sort-down fdk-color0" />
                }
                {(this.state.sortField !== 'title' || this.state.sortType !== 'desc') &&
                <i className="fa fa-sort-down fdk-color0" />
                }
              </button>
            </div>

          </div>
          <div className="d-flex align-items-center w-25">
            <span className="header-item mr-1">
              {localization.datasets.list.header.status}
            </span>
            <div className="d-flex">
              <button
                name="titleAsc"
                className="sortButton transparentButton"
                onClick={() => this.onSortField('registrationStatus', 'asc')}
                title="Stigende"
              >
                {this.state.sortField === 'registrationStatus' && this.state.sortType === 'asc' &&
                <i className="fa fa-sort-up fdk-color0" />
                }
                {(this.state.sortField !== 'registrationStatus' || this.state.sortType !== 'asc') &&
                <i className="fa fa-sort-up fdk-color0" />
                }
              </button>

              <button
                name="titleDesc"
                className="sortButton transparentButton"
                onClick={() => this.onSortField('registrationStatus', 'desc')}
                title="Synkende"
              >
                {this.state.sortField === 'registrationStatus' && this.state.sortType === 'desc' &&
                <i className="fa fa-sort-down fdk-color0" />
                }
                {(this.state.sortField !== 'registrationStatus' || this.state.sortType !== 'desc') &&
                <i className="fa fa-sort-down fdk-color0" />
                }
              </button>
            </div>
          </div>
        </div>

        {this._renderDatasetItems()}

        <ImportModal
          modal={this.state.showImportModal}
          handleAction={this.handleImportDataset}
          toggle={this.toggleImportModal}
          title={localization.datasets.import.title}
          body={localization.datasets.import.body}
          setURL={localization.datasets.import.setURL}
          btnCancel={localization.app.cancel}
          btnConfirm={localization.app.import}
        />
      </div>
    );
  }
}

DatasetItemsList.defaultProps = {
};

DatasetItemsList.propTypes = {
};

export default DatasetItemsList;
