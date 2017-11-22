import React from 'react';
import {Modal, ModalHeader, ModalTitle, ModalBody} from 'react-bootstrap';
import localization from '../../components/localization';
import CompareTermModalContent from '../search-concepts-compare-modal-content';
import './index.scss';

export default class CompareTermModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showBar: true
    }
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  close() {
    this.setState(
      {
        showModal: false,
        showBar: true
      }
    );
  }

  open() {
    this.setState(
      {
        showModal: true,
        showBar: false
      }
    );
  }

  render() {
    let cols = 'col-md-';
    switch ((12 / this.props.terms.length)) {
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

    const removeTerms = items => items.map((item, index) => (
      <div className={cols} key={`remove-${  index  }${item.uri}`}>
        <button className="fdk-button fdk-button-color1 fdk-button-on-white fdk-fullwidth fdk-margin-top-double fdk-modal-button" onClick={() => {this.props.handleDeleteTerm(index)}}>
          <i className="fa fa-times fdk-color0" />
          &nbsp;
          {localization.compare.remove}
        </button>
      </div>
    ));

    const bottomModalLabel = (
      <div>
        <button className="bottom-modal-label fdk-button fdk-button-color1 fdk-modal-button" onClick={this.open}>
          <i className="fa fa-chevron-up fdk-color0" />
          &nbsp;
          {localization.compare.added + this.props.terms.length + localization.compare.toCompare}
        </button>
      </div>
    );

    return (
      <div>
        <button className="fdk-button fdk-button-color1 fdk-fullwidth" onClick={this.open}>
          <i className="fa fa-chevron-up fdk-color0" />
          &nbsp;
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
              &nbsp;
              {localization.compare.hideCompare}
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            <CompareTermModalContent
              terms={this.props.terms}
              selectedLanguageCode={this.props.selectedLanguageCode}
              cols={cols}
            />
            <div className="row">
              {removeTerms(this.props.terms)}
            </div>
          </ModalBody>
        </Modal>
        {(this.state.showBar && this.props.terms.length > 0) ? bottomModalLabel : null}
      </div>
    );
  }
}
