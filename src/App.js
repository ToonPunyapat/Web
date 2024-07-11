import axios from "axios";
import { useState } from "react";
//import Template from "../components/Templates";
import Form from "react-bootstrap/Form";

function App() {
  const [customer, setCustomer] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");
  const [customerList, setCustomerList] = useState([]);

  const addCustomer = () => {
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
  };

  return (
    <div className="App container">
      <h1 className="text-center mt-3">Create Note Customer</h1>
      <div className="card">
        <div className="card-body">
          <div className="information">
            <form action="">
              <div className="">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter customer name"
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
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option>Open this select menu</option>
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
    </div>
  );
}

export default App;
