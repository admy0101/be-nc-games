const db = require("../db/connection.js");
const reviews = require("../db/data/test-data/reviews.js");

exports.selectReviewById = (review_id) => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id)::INTgit  AS comment_count FROM reviews
      LEFT JOIN comments ON comments.review_id = reviews.review_id WHERE reviews.review_id = $1
      GROUP BY reviews.review_id  `,
      [review_id]
    )
    .then((review) => {
      if (!review.rows.length) {
        return Promise.reject({ status: 404, msg: "Number not found" });
      } else {
        return review.rows[0];
      }
    });
};

exports.updateReviewByVotes = (review_id, votes) => {
  return db
    .query("UPDATE reviews SET votes = votes + $1 WHERE review_id = $2;", [
      votes,
      review_id,
    ])
    .then(() => {
      return db.query("SELECT * FROM reviews WHERE review_id = $1;", [
        review_id,
      ]);
    })
    .then((review) => {
      if (!review.rows.length) {
        return Promise.reject({ status: 404, msg: "Number not found" });
      } else {
        return review.rows[0];
      }
    });
};
