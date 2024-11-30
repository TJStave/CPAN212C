import { Modal, Button } from "react-bootstrap";
import { useState } from "react";

const SaveState = ({ showTriggers, saveFunc }) => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");

  const handleClose = () => setShow(false);

  const saveToDB = () => {
    if (name === "")
      return;
    saveFunc(name);
    handleClose();
  }

  showTriggers.showSave = setShow;

  return(
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Save Last Played Hand</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Enter name to save:
          <input
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Button onClick={saveToDB}>Save</Button>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default SaveState;