const { getAllCategories } = require("./controller/categories.controller");

const express = require("express");

const app = express();

app.get("/api/categories", getAllCategories);

app.use((req, res, next) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

module.exports = app;
