const express = require("express");
const router = express.Router();

const {
  postsPerAuthor,
  postsPerMonth,
  postsPerCategory,
  postsByDateRange,
} = require("../controllers/analyticsController");

router.get("/posts-per-author", postsPerAuthor);
router.get("/posts-per-month", postsPerMonth);
router.get("/posts-per-category", postsPerCategory);
router.get("/posts-by-date", postsByDateRange);

module.exports = router;
