import React from "react";
import Navbar from "../components/Navbar";

function Contact() {
  return (
    <div>
      <Navbar />
      <div className="d-flex justify-content-center position-absolute top-50 start-50 translate-middle">
        <div className="card text-center ">
          <div className="card-body ">
            <h5 className="card-title">Contact</h5>
            <p className="card-text">Tel. 091-073-9723</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
