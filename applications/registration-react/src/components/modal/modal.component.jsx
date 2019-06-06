import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const AppModal = ({ modal, toggle, className, title, body }) => (
  <div>
    <Modal isOpen={modal} toggle={() => toggle} className={className}>
      <ModalHeader toggle={toggle}>{title}</ModalHeader>
      <ModalBody>{body}</ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={toggle}>
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
