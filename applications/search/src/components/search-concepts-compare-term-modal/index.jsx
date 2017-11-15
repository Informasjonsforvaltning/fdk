import React from 'react';
import {Modal, ModalHeader, ModalTitle, ModalBody} from 'react-bootstrap';
import localization from '../../components/localization';
import CompareTermModalContent from '../search-concepts-compare-term-modal-content';
import './index.scss';

export default class CompareTermModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    }
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  render() {
    return (
      <div>
        <button className="fdk-button fdk-button-cta btn-block" onClick={this.open}>
          {localization.compare.openCompare}
        </button>
        <Modal 
          show={this.state.showModal} 
          onHide={this.close}
          bsSize="large"
          dialogClassName="fdk-modal"
        >
          <ModalHeader>
            <ModalTitle onClick={this.close}>     
              <i className="fa fa-chevron-down fdk-fa-left fa-lg fdk-color0" />
              {localization.compare.hideCompare}
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            <CompareTermModalContent
              terms={this.props.terms}
              selectedLanguageCode={this.props.selectedLanguageCode}
            />
          </ModalBody>
        </Modal>
      </div>
    );
  }
}