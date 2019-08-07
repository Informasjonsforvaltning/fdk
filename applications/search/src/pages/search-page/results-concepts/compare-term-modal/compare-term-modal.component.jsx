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
    const { terms, handleDeleteTerm } = this.props;
    const { showModal, showBar } = this.state;
    let cols = 'col-md-';
    switch (12 / terms.length) {
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
            type="button"
            className="fdk-concepts-compare-rm-term fdk-button-small fdk-fullwidth mt-5 fdk-modal-button"
            onClick={() => handleDeleteTerm(index)}
          >
            <i className="fa fa-times fdk-white" />
            &nbsp;
            {localization.compare.remove}
          </button>
        </div>
      ));

    const bottomModalLabel = (
      <div>
        <button
          type="button"
          className="bottom-modal-label fdk-button fdk-button-cta fdk-modal-button"
          onClick={() => {
            this.open('BOTTOM');
          }}
        >
          <i className="fa fa-chevron-up fdk-white" />
          &nbsp;
          {localization.compare.added +
            terms.length +
            localization.compare.toCompare}
        </button>
      </div>
    );

    return (
      <div className="d-flex justify-content-center">
        <button
          type="button"
          className="fdk-button-small fdk-color-link"
          onClick={this.open}
        >
          {localization.compare.openCompare}
        </button>
        <Modal
          isOpen={showModal}
          toggle={this.close}
          className="fdk-modal modal-lg"
        >
          <ModalHeader toggle={this.close}>
            <i className="fa fa-chevron-down fdk-fa-left fa-lg fdk-white" />
            &nbsp;
            {localization.compare.compare}
          </ModalHeader>
          <ModalBody>
            <CompareTermModalContent terms={terms} cols={cols} />
            <div className="row">{removeTerms(terms)}</div>
          </ModalBody>
        </Modal>
        {showBar && terms.length > 0 ? bottomModalLabel : null}
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
