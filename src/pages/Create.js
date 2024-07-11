import axios from "axios";
import { useState } from "react";
import Template from "../components/Template";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function Create() {
  const [customer, setCustomer] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");
  const [customerList, setCustomerList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const addCustomer = (e) => {
    e.preventDefault();
    if (customer === "" || note === "" || category === "") {
      setShowModal(true);
    } else {
      axios
        .post("http://localhost:3001/create", {
          customer: customer,
          note: note,
          category: category,
        })
        .then(() => {
          setCustomerList([
            ...customerList,
            {
              customer: customer,
              note: note,
              historynote: note,
              category: category,
            },
          ]);
        });
      setCustomer("");
      setNote("");
      setCategory("");
    }
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div>
      <Template />
      <div className="App container">
        <h1 className="text-center mt-3">Create Note Customer</h1>
        <div className="card">
          <div className="card-body">
            <div className="information">
              <form action="">
                <div className="">
                  <div className="mb-3 text-start">
                    <label htmlFor="name" className="form-label">
                      Name:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter customer name"
                      value={customer}
                      onChange={(e) => setCustomer(e.target.value)}
                    />
                    <div />
                    <div className="mb-2 mt-2">
                      <label htmlFor="name" className="form-label">
                        Note:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="note" className="form-label">
                        Category:
                      </label>
                      <Form.Select
                        id="mySelect"
                        aria-label="Default select example"
                        className=""
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">Open this select menu</option>
                        <option value="Front-end">Front-end</option>
                        <option value="Back-end">Back-end</option>
                        <option value="Database">Database</option>
                      </Form.Select>
                    </div>

                    <button className="btn btn-success" onClick={addCustomer}>
                      Add note
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>Cannot add note. Please fill out all fields.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default Create;
