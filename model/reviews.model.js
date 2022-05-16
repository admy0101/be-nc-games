const db = require("../db/connection.js");

exports.selectReviewById = (review_id) => {
  console.log("in the review model");
  console.log(new Date(1610964020514), "the date");
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1;", [review_id])
    .then((review) => {
      return review.rows[0];
    });
};
