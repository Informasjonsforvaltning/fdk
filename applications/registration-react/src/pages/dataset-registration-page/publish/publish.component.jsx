import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import moment from 'moment';
import Moment from 'react-moment';
import 'moment/locale/nb';
import axios from 'axios';

import Modal from '../../../components/modal/modal.component';
import AppDeleteModal from '../../../components/delete-modal/delete-modal.component';
import localization from '../../../utils/localization';
import { publishDataset } from '../../../actions/index';
import './publish.scss';

export default class DatasetPublish extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      showPublishModal: false,
      showPublishInfo: false,
      showDeleteModal: false
    };
    this.toggle = this.toggle.bind(this);
    this.handleDatasetStatus = this.handleDatasetStatus.bind(this);
    this.showDeleteModal = this.showDeleteModal.bind(this);
    this.closeDeleteModal = this.closeDeleteModal.bind(this);
    this.handleDatasetDelete = this.handleDatasetDelete.bind(this);
  }

  toggle() {
    this.setState({
      showPublishModal: !this.state.showPublishModal
    });
  }

  handleDatasetStatus(value) {
    const { syncErrors, distributionErrors } = this.props;
    const postURL = window.location.pathname;
    const api = {
      Authorization: `Basic ${null}`
    };
    const values = {
      registrationStatus: value
    };

    let foundDistributionErrors = false;
    if (distributionErrors) {
      const { distribution } = distributionErrors;
      if (distribution) {
        distribution.forEach(item => {
          if (JSON.stringify(item) !== '{}') {
            foundDistributionErrors = true;
          }
        });
      }
    }

    let allowedToPublish = false;
    if (
      (value === 'PUBLISH' && !syncErrors && !foundDistributionErrors) ||
      value === 'DRAFT'
    ) {
      allowedToPublish = true;
    }
    if (allowedToPublish) {
      if (value === 'PUBLISH') {
        this.setState({
          showPublishInfo: true
        });
      }
      return axios
        .patch(postURL, values, { headers: api })
        .then(() => {
          this.props.dispatch(publishDataset(value));
        })
        .catch(response => {
          const { error } = response;
          return Promise.reject(error);
        });
    }
    this.setState({
      showPublishModal: true
    });
    return null;
  }

  showDeleteModal() {
    this.setState({
      showDeleteModal: true
    });
  }

  closeDeleteModal() {
    this.setState({
      showDeleteModal: false
    });
  }

  handleDatasetDelete() {
    this.closeDeleteModal();
    const datasetURL = window.location.pathname;
    // find catalog url, remove all from second last slash
    const catalogDatasetsURL = datasetURL.substring(
      0,
      datasetURL.lastIndexOf('/', datasetURL.lastIndexOf('/') - 1)
    );
    const api = {
      Authorization: `Basic user:password`
    };
    return axios
      .delete(datasetURL, { headers: api })
      .then(() => {
        window.location.replace(catalogDatasetsURL);
      })
      .catch(response => {
        const { error } = response;
        return Promise.reject(error);
      });
  }

  render() {
    const { registrationStatus, lastSaved } = this.props;
    const calendarStrings = {
      lastDay: '[i går kl.] LT',
      sameDay() {
        return `[for ${moment(lastSaved).fromNow()}]`;
      },
      lastWeek: '[på] dddd [kl.] LT',
      sameElse: 'DD.MM.YYYY'
    };
    return (
      <div>
        <div className="d-flex align-items-center ml-2 mt-5">
          {registrationStatus === 'DRAFT' && (
            <Button
              id="dataset-setPublish-button"
              className="fdk-button w-25 mr-3"
              color="primary"
              onClick={() => this.handleDatasetStatus('PUBLISH')}
            >
              Publiser
            </Button>
          )}
          {registrationStatus === 'PUBLISH' && (
            <Button
              id="dataset-setDraft-button"
              className="fdk-button w-25 mr-3"
              color="info"
              onClick={() => this.handleDatasetStatus('DRAFT')}
            >
              Avpubliser
            </Button>
          )}
          <div>
            {lastSaved && (
              <span>
                <i className="fa fa-check-circle mr-2" />
                {`${localization.app.lastSaved} `}{' '}
                <Moment locale="nb" calendar={calendarStrings}>
                  {lastSaved}
                </Moment>
              </span>
            )}
          </div>
        </div>

        <div className="ml-2 mt-5">
          {registrationStatus === 'DRAFT' && (
            <div>
              <strong>{localization.app.notPublished}</strong>
              <div>{localization.app.notPublishedText}</div>
            </div>
          )}
          {registrationStatus === 'PUBLISH' &&
            this.state.showPublishInfo && (
              <div className="mt-2 alert alert-success" role="alert">
                <strong>{localization.app.published}</strong>{' '}
                {localization.app.publishedText}
              </div>
            )}

          <div className="mt-2 ">
            <button
              className="fdk-dataset-delete text-left p-0"
              onClick={this.showDeleteModal}
            >
              <i className="mr-1 fa fa-trash fdk-color-red" />
              Slette datasett
            </button>
          </div>
        </div>
        <Modal
          modal={this.state.showPublishModal}
          toggle={this.toggle}
          title={localization.validation.validateDataset}
          body={localization.validation.validateDatasetBody}
        />

        <AppDeleteModal
          modal={this.state.showDeleteModal}
          handleAction={this.handleDatasetDelete}
          toggle={this.closeDeleteModal}
          title={localization.deleteDataset.title}
          body={localization.deleteDataset.body}
        />
      </div>
    );
  }
}

DatasetPublish.defaultProps = {
  registrationStatus: false,
  syncErrors: false,
  distributionErrors: null,
  lastSaved: null
};

DatasetPublish.propTypes = {
  dispatch: PropTypes.func.isRequired,
  registrationStatus: PropTypes.string,
  syncErrors: PropTypes.bool,
  distributionErrors: PropTypes.object,
  lastSaved: PropTypes.string
};
