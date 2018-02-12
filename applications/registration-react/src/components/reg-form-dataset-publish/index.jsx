import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import moment from 'moment';
import Moment from 'react-moment';
import 'moment/locale/nb';
import axios from 'axios';

import Modal from '../app-modal';

import localization from '../../utils/localization';
import {
  publishDataset
} from '../../actions/index';

export default class DatasetPublish extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      showPublishModal: false,
      showPublishInfo: false
    };
    this.toggle = this.toggle.bind(this);
    this.handleDatasetStatus = this.handleDatasetStatus.bind(this);
  }

  toggle() {
    this.setState({
      showPublishInfo: true
    });
  }

  handleDatasetStatus(value) {
    const { syncErrors } = this.props;
    const postURL = window.location.pathname;
    const api = {
      Authorization: `Basic ${  null}`
    }
    const values = {
      registrationStatus: value
    }

    let allowedToPublish = false;
    if ( (value === 'PUBLISH' && !syncErrors) || value === 'DRAFT') {
      allowedToPublish = true;
    }
    if (allowedToPublish) {
      if (value === 'PUBLISH') {
        this.setState({
          showPublishInfo: true
        })
      }
      return axios.patch(
        postURL, values, {headers: api}
      )
        .then((response) => {
          this.props.dispatch(publishDataset(value));
        })
        .catch((error) => {
          throw {error}
        })
      ;
    }
    this.setState({
      showPublishModal: true
    })
    return null;
  }

  render() {
    const { registrationStatus, lastSaved } = this.props;
    const calendarStrings = {
      lastDay : '[i går kl.] LT',
      sameDay() {return `[for ${moment(lastSaved).fromNow()}]`},
      lastWeek : '[på] dddd [kl.] LT',
      sameElse : 'DD.MM.YYYY'
    };
    return (
      <div>
        <div className="d-flex align-items-center ml-2 mt-5">
          {registrationStatus === 'DRAFT' &&
          <Button
            id="dataset-setPublish-button"
            className="fdk-button fdk-button-default w-25 mr-3"
            color="secondary"
            onClick={() => this.handleDatasetStatus('PUBLISH')}
          >
            Publiser
          </Button>
          }
          {registrationStatus === 'PUBLISH' &&
          <Button
            id="dataset-setDraft-button"
            className="fdk-button fdk-button-default w-25 mr-3"
            color="info"
            onClick={() => this.handleDatasetStatus('DRAFT')}
          >
            Avpubliser
          </Button>
          }
          <div>
            {lastSaved &&
            <span>
              <i className="fa fa-check-circle mr-2" />
              {`${localization.app.lastSaved} `} <Moment locale="nb" calendar={calendarStrings}>{lastSaved}</Moment>
            </span>
            }
          </div>
        </div>

        <div className="ml-2 mt-5">
          {registrationStatus === 'DRAFT' &&
          (
            <div>
              <strong>{localization.app.notPublished}</strong>
              <div>
                {localization.app.notPublishedText}
              </div>
            </div>
          )}
          {registrationStatus === 'PUBLISH' && this.state.showPublishInfo &&
          (
            <div className="mt-2 alert alert-success" role="alert">
              <strong>{localization.app.published}</strong> {localization.app.publishedText}
            </div>
          )}


        </div>
        <Modal
          modal={this.state.showPublishModal}
          toggle={this.toggle}
          title={localization.validation.validateDataset}
          body={localization.validation.validateDatasetBody}
        />

      </div>
    );
  }
}

DatasetPublish.defaultProps = {
  registrationStatus: false
};

DatasetPublish.propTypes = {
  dispatch: PropTypes.func.isRequired,
  registrationStatus: PropTypes.string
};
