import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';

import localization from '../../../../lib/localization';
import { CompareTermModalContent } from './compare-term-modal-content/compare-term-modal-content.component';
import './compare-term-modal.scss';

const ReactGA = require('react-ga');

export class CompareTermModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showBar: true
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  close() {
    this.setState({
      showModal: false,
      showBar: true
    });
  }

  open(type) {
    if (type === 'BOTTOM') {
      ReactGA.event({
        category: 'Begrep',
        action: 'Sammenligningsvindu',
        label: 'Sticky button'
      });
    } else {
      ReactGA.event({
        category: 'Begrep',
        action: 'Sammenligningsvindu',
        label: 'Left menu button'
      });
    }
    ReactGA.modalview('/concepts/compare');
    this.setState({
      showModal: true,
      showBar: false
    });
  }

  render() {
    let cols = 'col-md-';
    switch (12 / this.props.terms.length) {
      case 6:
        cols += '6';
        break;
      case 4:
        cols += '4';
        break;
      default:
        cols += '6';
        break;
    }

    const removeTerms = items =>
      items.map((item, index) => (
        <div className={cols} key={`remove-${index}${item.uri}`}>
          <button
            className="fdk-concepts-compare-rm-term fdk-button-small fdk-fullwidth mt-5 fdk-modal-button"
            onClick={() => {
              this.props.handleDeleteTerm(index);
            }}
          >
            <i className="fa fa-times fdk-color0" />
            &nbsp;
            {localization.compare.remove}
          </button>
        </div>
      ));

    const bottomModalLabel = (
      <div>
        <button
          className="bottom-modal-label fdk-button fdk-button-cta fdk-modal-button"
          onClick={() => {
            this.open('BOTTOM');
          }}
        >
          <i className="fa fa-chevron-up fdk-color0" />
          &nbsp;
          {localization.compare.added +
            this.props.terms.length +
            localization.compare.toCompare}
        </button>
      </div>
    );

    return (
      <div className="d-flex justify-content-center">
        <button
          className="fdk-button-small fdk-color-blue-dark"
          onClick={this.open}
        >
          {localization.compare.openCompare}
        </button>
        <Modal
          isOpen={this.state.showModal}
          toggle={this.close}
          className="fdk-modal modal-lg"
        >
          <ModalHeader toggle={this.close}>
            <i className="fa fa-chevron-down fdk-fa-left fa-lg fdk-color0" />
            &nbsp;
            {localization.compare.compare}
          </ModalHeader>
          <ModalBody>
            <CompareTermModalContent terms={this.props.terms} cols={cols} />
            <div className="row">{removeTerms(this.props.terms)}</div>
          </ModalBody>
        </Modal>
        {this.state.showBar && this.props.terms.length > 0
          ? bottomModalLabel
          : null}
      </div>
    );
  }
}

CompareTermModal.defaultProps = {
  terms: null
};

CompareTermModal.propTypes = {
  terms: PropTypes.array,
  handleDeleteTerm: PropTypes.func.isRequired
};
