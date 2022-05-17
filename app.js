const { getAllCategories } = require("./controller/categories.controller");
const {
  getReviewById,
  patchReviewByVotes,
} = require("./controller/reviews.controller.js");

const express = require("express");

const app = express();
app.use(express.json());

app.get("/api/categories", getAllCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReviewByVotes);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

app.use("/*", (req, res, next) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

module.exports = app;
