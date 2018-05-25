import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const AppModal = props => (
  <div>
    <Modal
      isOpen={props.modal}
      toggle={() => props.toggle}
      className={props.className}
    >
      <ModalHeader toggle={props.toggle}>{props.title}</ModalHeader>
      <ModalBody>{props.body}</ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={props.toggle}>
          Ok
        </Button>
      </ModalFooter>
    </Modal>
  </div>
);

AppModal.defaultProps = {
  modal: false,
  className: null,
  title: null,
  body: null
};

AppModal.propTypes = {
  modal: PropTypes.bool,
  toggle: PropTypes.func.isRequired,
  className: PropTypes.string,
  title: PropTypes.string,
  body: PropTypes.string
};

export default AppModal;
