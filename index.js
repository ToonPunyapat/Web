const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "customernotes",
});

app.post("/create", (req, res) => {
  const customer = req.body.customer;
  const note = req.body.note;
  const historynote = req.body.historynote;
  const category = req.body.category;

  db.query(
    "INSERT INTO customers (customer, note, category_note) VALUES (?, ?, ?)",
    [customer || null, note || null, category || null],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Customer added");
      }
    }
  );
});

app.get("/search", (req, res) => {
  const category = req.query.category;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  let sqlCount = "SELECT COUNT(*) AS count FROM customers";
  let sqlData = "SELECT * FROM customers";
  let params = [];

  if (category && category !== "All") {
    sqlCount += " WHERE category_note = ?";
    sqlData += " WHERE category_note = ?";
    params.push(category);
  }

  sqlData += " LIMIT ? OFFSET ?";
  params.push(limit, offset);

  db.query(sqlCount, params.slice(0, params.length - 2), (err, countResults) => {
    if (err) {
      console.error("Error fetching customers count:", err.sqlMessage || err);
      res.status(500).send("An error occurred while fetching customers.");
      return;
    }

    const totalCustomers = countResults[0].count;
    const totalPages = Math.ceil(totalCustomers / limit);

    db.query(sqlData, params, (err, results) => {
      if (err) {
        console.error("Error fetching customers:", err.sqlMessage || err);
        res.status(500).send("An error occurred while fetching customers.");
        return;
      }

      res.json({ customers: results, totalPages: totalPages });
    });
  });
});


app.put("/update", (req, res) => {
  const { id, note, category_note } = req.body;

  if (!id || !note || !category_note) {
    res.status(400).send("Missing required fields: id, note, or category");
    return;
  }

  const sql = "UPDATE customers SET note = ?, category_note = ? WHERE id = ?";
  db.query(sql, [note, category_note, id], (err, result) => {
    if (err) {
      console.error("Error updating customer:", err.sqlMessage || err);
      res.status(500).send("An error occurred while updating the customer.");
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send("Customer not found");
      return;
    }
    res.send("Customer updated successfully");
  });
});

app.delete("/delete", (req, res) => {
  const { id } = req.body;
  const sql = "DELETE FROM customers WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting customer:", err);
      return res.status(500).send("Error deleting customer");
    }
    res.send("Customer deleted successfully");
  });
});

app.listen("3001", () => {
  console.log("Server is running");
});
