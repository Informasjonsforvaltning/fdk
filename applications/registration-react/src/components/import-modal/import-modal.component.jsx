import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import localization from '../../lib/localization';

export default class AppImportModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: null,
      errorMsg: null
    };
    this.onBtnConfirm = this.onBtnConfirm.bind(this);
    this.handleChangeURL = this.handleChangeURL.bind(this);
  }

  onBtnConfirm() {
    const { url } = this.state;
    const { handleAction } = this.props;
    if (url && url !== '') {
      handleAction(this.state.url);
      this.setState({
        url: null,
        errorMsg: null
      });
    } else {
      this.setState({
        errorMsg: localization.datasets.import.notEmpty
      });
    }
  }

  onBtnCancel() {
    const { toggle } = this.props;
    this.setState({
      url: null,
      errorMsg: null
    });
    toggle();
  }

  handleChangeURL(e) {
    this.setState({
      url: e.target.value
    });
  }

  render() {
    const {
      modal,
      toggle,
      className,
      title,
      body,
      setURL,
      btnConfirm,
      btnCancel
    } = this.props;
    return (
      <div>
        <Modal isOpen={modal} toggle={() => toggle} className={className}>
          <ModalHeader toggle={toggle}>{title}</ModalHeader>
          <ModalBody>
            {body}
            <div className="d-flex flex-column align-items-center mt-5">
              <label className="fdk-form-label w-100" htmlFor="importURL">
                {setURL}
                <input
                  id="importURL"
                  className="form-control"
                  type="input"
                  onChange={e => this.handleChangeURL(e)}
                />
              </label>
              {this.state.errorMsg && (
                <div className="alert alert-danger mt-3 w-100">
                  {this.state.errorMsg}
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter className="d-flex justify-content-center">
            <Button color="danger" onClick={() => this.onBtnConfirm()}>
              {btnConfirm}
            </Button>
            <Button
              color="primary"
              onClick={() => {
                this.onBtnCancel();
              }}
            >
              {btnCancel}
            </Button>
          </ModalFooter>
          <ModalFooter />
        </Modal>
      </div>
    );
  }
}

AppImportModal.defaultProps = {
  modal: false,
  className: null,
  title: null,
  body: null,
  setURL: null,
  btnConfirm: null,
  btnCancel: null
};

AppImportModal.propTypes = {
  handleAction: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  modal: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.string,
  body: PropTypes.string,
  setURL: PropTypes.string,
  btnConfirm: PropTypes.string,
  btnCancel: PropTypes.string
};
