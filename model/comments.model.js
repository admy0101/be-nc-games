const db = require("../db/connection.js");

exports.removeComment = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id =$1;`, [comment_id])
    .then((comments) => {
      if (!comments.rows.length) {
        return Promise.reject({ status: 404, msg: "Number not found" });
      } else {
        return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [
          comment_id,
        ]);
      }
    });
};
