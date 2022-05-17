const db = require("../db/connection.js");

exports.selectReviewById = (review_id) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1;", [review_id])
    .then((review) => {
      if (!review.rows.length) {
        return Promise.reject({ status: 404, msg: "Number not found" });
      } else {
        return review.rows[0];
      }
    });
};
