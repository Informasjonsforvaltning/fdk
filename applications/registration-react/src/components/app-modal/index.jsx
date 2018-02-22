import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const AppModal  = (props) => (
  <div>
    <Modal isOpen={props.modal} toggle={() => props.toggle} className={props.className}>
      <ModalHeader toggle={props.toggle}>{props.title}</ModalHeader>
      <ModalBody>
        {props.body}
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={props.toggle}>Ok</Button>
      </ModalFooter>
    </Modal>
  </div>
);


export default AppModal;
