import React, { useState } from "react";
import Template from "../components/Template";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import axios from "axios";

function Search() {
  const [category, setCategory] = useState("");
  const [customers, setCustomers] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [pageSize, setPageSize] = useState(3);

  const getCustomers = async (category, page = 1) => {
    let params = {
      page: page,
      limit: pageSize,
    };
    if (category && category !== "All") {
      params.category = category;
    }

    await axios
      .get("http://localhost:3001/search", { params })
      .then((response) => {
        console.log(response.data); // Debugging output
        setCustomers(response.data.customers);
        setTotalPages(response.data.totalPages);
        setTotalResults(response.data.totalResults);
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
      });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setTotalResults(0); // Reset total results before fetching new data
    getCustomers(category, 1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    getCustomers(category, page);
  };

  const handleClear = () => {
    setCurrentPage(1);
    setCustomers([]);
    setTotalPages(1); // Reset total pages to hide the pagination
    setTotalResults(0); // Reset total results
  };

  const handleUpdateClick = (customer) => {
    setSelectedCustomer(customer);
    setNewNote(customer.note);
    setNewCategory(customer.category_note);
    setShowModal(true);
  };

  const handleUpdate = () => {
    if (selectedCustomer) {
      axios
        .put("http://localhost:3001/update", {
          id: selectedCustomer.id,
          note: newNote,
          category_note: newCategory,
        })
        .then((response) => {
          setShowModal(false);
          getCustomers(category, currentPage);
        })
        .catch((error) => {
          console.error("Error updating customer:", error);
        });
    }
  };

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (customerToDelete) {
      axios
        .delete("http://localhost:3001/delete", {
          data: { id: customerToDelete.id },
        })
        .then((response) => {
          setCustomers(
            customers.filter((customer) => customer.id !== customerToDelete.id)
          );
          setShowDeleteModal(false);
        })
        .catch((error) => {
          console.error("Error deleting customer:", error);
        });
    }
  };

  return (
    <div>
      <Template />
      <div className="container">
        <h1 className="text-center mt-3">Search Note Customer</h1>
        <div className="card">
          <div className="card-box p-3">
            <span>Category</span>
            <Form.Select
              id="mySelect"
              aria-label="Default select example"
              className="mt-2"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Front-end">Front-end</option>
              <option value="Back-end">Back-end</option>
              <option value="Database">Database</option>
            </Form.Select>
            <div className="d-flex">
              <button className="btn btn-primary mt-3" onClick={handleSearch}>
                Search
              </button>
              <button
                className="btn btn-danger mt-3 ms-2"
                onClick={handleClear}
              >
                Clear
              </button>
              <span className="mt-4 ms-3">
                {totalResults > 0 && `Found ${totalResults} results.`}
              </span>
            </div>

            {customers.map((customer) => (
              <div key={customer.id} className="card mt-3">
                <div className="card-body">
                  <div>
                    <h3 className="card-title">Name: {customer.customer}</h3>
                    <p className="card-text mb-0">Note: {customer.note}</p>
                    <p className="card-text">
                      Category: {customer.category_note}
                    </p>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => handleUpdateClick(customer)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-outline-danger ms-2"
                      onClick={() => handleDeleteClick(customer)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {customers.length > 0 && (
              <div className="mt-3">
                <Pagination>
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </div>
            )}
          </div>
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Customer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Note</Form.Label>
                <Form.Control
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option value="Front-end">Front-end</option>
                  <option value="Back-end">Back-end</option>
                  <option value="Database">Database</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Customer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this customer?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default Search;
