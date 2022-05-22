const db = require("../db/connection.js");


exports.selectReviewById = (review_id) => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count FROM reviews
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

exports.selectAllReviews = (
  sort_by = "created_at",
  order = "desc",
  category
) => {
  let queryParams = [];
  let queryString = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.designer, reviews.review_body, review_img_url, reviews.created_at ::DATE, reviews.votes, COUNT(comments.review_id)::INT AS comment_count FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id `;

  if (category) {
    queryString += `WHERE category = $1 `;
    queryParams.push(category);
  }
  queryString += `GROUP BY reviews.review_id ORDER BY  ${sort_by} ${order};`;

  if (
    ![
      "owner",
      "title",
      "designer",
      "review_img_url",
      "review_body",
      "category",
      "created_at",
      "votes",
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  } else if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  } else {
    return db.query(queryString, queryParams).then((result) => {
      return result.rows;
    });
  }
};

exports.selectCommentsById = (review_id) => {
  return db
    .query(`SELECT * FROM comments WHERE review_id = $1;`, [review_id])
    .then((comments) => {
      return comments.rows;
    });
};

exports.insertComment = (review_id, reqBody) => {
  const commentBody = reqBody.body;
  const commentAuthor = reqBody.username;
  return db
    .query(
      `INSERT INTO comments(body, author, review_id) VALUES($1, $2, $3) RETURNING *`,
      [commentBody, commentAuthor, review_id]
    )
    .then((comment) => {
      return comment.rows[0];
    });
};
