import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

function Templates() {
  return (
    <div>
      <Navbar />
      <Link to="/create">Create</Link>
      <Link to="/search">Search</Link>
    </div>
  );
}

export default Templates;
