import React from 'react';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import axios from 'axios';

import localization from '../../../utils/localization';
import DatasetItemsListItem from './list-item/list-item.component';
import ImportModal from '../../../components/import-modal/import-modal.component';
import SortButtons from '../../../components/sort-button/sort-button.component';
import './items-list.scss';

const handleCreateDataset = () => {
  const catalogURL = window.location.pathname;
  const datasetPath = 'datasets/';

  const header = {
    Accept: 'application/json'
  };

  const getInit = {
    headers: header,
    credentials: 'same-origin'
  };

  return axios
    .post(`${catalogURL}/${datasetPath}`, getInit)
    .then(response => {
      window.location.replace(
        `${catalogURL}/${datasetPath}${response.data.id}`
      );
    })
    .catch(response => {
      const { error } = response;
      return Promise.reject(error);
    });
};

class DatasetItemsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortField: '',
      sortType: '',
      showImportModal: false
    };
    this.onSortField = this.onSortField.bind(this);
    this.toggleImportModal = this.toggleImportModal.bind(this);
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

  handleImportDataset(url) {
    const catalogURL = window.location.pathname;
    const datasetPath = 'datasets/';

    this.setState({
      showImportModal: false
    });

    const header = {
      Accept: 'application/json'
    };

    const getInit = {
      headers: header,
      credentials: 'same-origin'
    };

    return axios
      .post(`${catalogURL}`, url, getInit)
      .then(response => {
        window.location.replace(
          `${catalogURL}/${datasetPath}${response.data.id}`
        );
      })
      .catch(response => {
        const { error } = response;
        return Promise.reject(error);
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
    const { catalogId, datasetItems } = this.props;
    if (datasetItems) {
      if (this.state.sortField === 'title') {
        // order by title and ignore case
        orderBy(
          datasetItems,
          [
            item => {
              const { nb } = item.title;
              if (nb) {
                return nb.toLowerCase();
              }
              return null;
            }
          ],
          [this.state.sortType]
        );
      } else if (this.state.sortField === 'registrationStatus') {
        orderBy(datasetItems, 'registrationStatus', [this.state.sortType]);
      }

      return datasetItems.map(item => (
        <DatasetItemsListItem key={item.id} catalogId={catalogId} item={item} />
      ));
    }
    return (
      <div className="fdk-datasets-list-item d-flex">
        <span className="fdk-text-size-small fdk-color2">
          {localization.datasets.list.missingItems}
        </span>
      </div>
    );
  }

  render() {
    const { sortField, sortType } = this.state;
    return (
      <div>
        <div className="d-flex mb-3">
          <button
            className="fdk-button fdk-button-cta"
            onClick={handleCreateDataset}
          >
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
            <SortButtons
              field="title"
              sortField={sortField}
              sortType={sortType}
              onSortField={this.onSortField}
            />
          </div>

          <div className="d-flex align-items-center w-25">
            <span className="header-item mr-1">
              {localization.datasets.list.header.status}
            </span>
            <SortButtons
              field="registrationStatus"
              sortField={sortField}
              sortType={sortType}
              onSortField={this.onSortField}
            />
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
  datasetItems: null
};

DatasetItemsList.propTypes = {
  catalogId: PropTypes.string.isRequired,
  datasetItems: PropTypes.array
};

export default DatasetItemsList;
