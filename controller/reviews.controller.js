const { selectReviewById } = require("../model/reviews.model");

exports.getReviewById = (req, res) => {
  const { review_id } = req.params;
  selectReviewById(review_id).then((review) => {
    console.log("in the review controller");
    res.status(200).send({ review: review });
  });
};
