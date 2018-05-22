import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const AppDeleteModal = props => (
  <div>
    <Modal
      isOpen={props.modal}
      toggle={() => props.toggle}
      className={props.className}
    >
      <ModalHeader toggle={props.toggle}>{props.title}</ModalHeader>
      <ModalBody>{props.body}</ModalBody>
      <ModalFooter className="d-flex justify-content-center">
        <Button color="danger" onClick={() => props.handleAction()}>
          Ja, slett datasettet
        </Button>
        <Button color="primary" onClick={props.toggle}>
          Nei, behold datasettet
        </Button>
      </ModalFooter>
      <ModalFooter />
    </Modal>
  </div>
);

AppDeleteModal.defaultProps = {
  modal: false,
  className: 'null',
  title: 'null',
  body: 'null'
};

AppDeleteModal.propTypes = {
  modal: PropTypes.bool,
  toggle: PropTypes.func.isRequired,
  className: PropTypes.string,
  title: PropTypes.string,
  body: PropTypes.string,
  handleAction: PropTypes.func.isRequired
};

export default AppDeleteModal;
