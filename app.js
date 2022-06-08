const { getAllCategories } = require("./controller/categories.controller");
const {
  getReviewById,
  patchReviewByVotes,
  getAllReviews,
  getCommentsById,
  postComment,
} = require("./controller/reviews.controller.js");
const { getAllUsers } = require("./controller/users.controller.js");
const { deleteComment } = require("./controller/comments.controller.js");
const { getAllEndpoints } = require("./controller/endpoints.controller.js");

const express = require("express");

const app = express();
app.use(express.json());

app.get("/api/categories", getAllCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReviewByVotes);
app.get("/api/users", getAllUsers);
app.get("/api/reviews", getAllReviews);
app.get("/api/reviews/:review_id/comments", getCommentsById);
app.post("/api/reviews/:review_id/comments", postComment);
app.delete("/api/comments/:comment_id", deleteComment);
app.get("/api", getAllEndpoints);

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Invalid input" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "user not found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else {
    next(err);
  }
});

app.use("/*", (req, res, next) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

module.exports = app;
