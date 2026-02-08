const mongoose = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");

// Posts per Author
exports.postsPerAuthor = async (req, res) => {
  try {
    const { author, start, end } = req.query;

    // Build optional match filter
    const match = {};

    if (author) {
      if (!mongoose.Types.ObjectId.isValid(author))
        return res.status(400).json({ message: "Invalid author id" });
      match.author = mongoose.Types.ObjectId(author);
    }

    if (start) {
      const s = new Date(start);
      if (isNaN(s))
        return res.status(400).json({ message: "Invalid start date" });
      match.createdAt = match.createdAt || {};
      match.createdAt.$gte = s;
    }

    if (end) {
      const e = new Date(end);
      if (isNaN(e))
        return res.status(400).json({ message: "Invalid end date" });
      match.createdAt = match.createdAt || {};
      match.createdAt.$lte = e;
    }

    const pipeline = [];
    if (Object.keys(match).length) pipeline.push({ $match: match });

    // Group posts by author
    pipeline.push(
      {
        $group: {
          _id: "$author",
          totalPosts: { $sum: 1 },
        },
      },

      // Join with User collection to get author details
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "authorInfo",
        },
      },

      // Clean output
      {
        $project: {
          _id: 0,
          author: { $arrayElemAt: ["$authorInfo.name", 0] },
          totalPosts: 1,
        },
      },
    );

    const data = await Post.aggregate(pipeline);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Posts per month

exports.postsPerMonth = async (req, res) => {
  try {
    const { author, start, end } = req.query;

    const match = {};
    if (author) {
      if (!mongoose.Types.ObjectId.isValid(author))
        return res.status(400).json({ message: "Invalid author id" });
      match.author = mongoose.Types.ObjectId(author);
    }

    if (start) {
      const s = new Date(start);
      if (isNaN(s))
        return res.status(400).json({ message: "Invalid start date" });
      match.createdAt = match.createdAt || {};
      match.createdAt.$gte = s;
    }

    if (end) {
      const e = new Date(end);
      if (isNaN(e))
        return res.status(400).json({ message: "Invalid end date" });
      match.createdAt = match.createdAt || {};
      match.createdAt.$lte = e;
    }

    const pipeline = [];
    if (Object.keys(match).length) pipeline.push({ $match: match });

    pipeline.push(
      // Group posts by year + month
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: 1 },
        },
      },

      // Project readable fields and keep total
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          monthLabel: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              {
                $cond: [
                  { $lt: ["$_id.month", 10] },
                  { $concat: ["0", { $toString: "$_id.month" }] },
                  { $toString: "$_id.month" },
                ],
              },
            ],
          },
          total: 1,
        },
      },

      // Sort chronologically
      { $sort: { year: 1, month: 1 } },
    );

    const data = await Post.aggregate(pipeline);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Posts per category
exports.postsPerCategory = async (req, res) => {
  try {
    const { author, start, end } = req.query;

    const match = {};
    if (author) {
      if (!mongoose.Types.ObjectId.isValid(author))
        return res.status(400).json({ message: "Invalid author id" });
      match.author = mongoose.Types.ObjectId(author);
    }

    if (start) {
      const s = new Date(start);
      if (isNaN(s))
        return res.status(400).json({ message: "Invalid start date" });
      match.createdAt = match.createdAt || {};
      match.createdAt.$gte = s;
    }

    if (end) {
      const e = new Date(end);
      if (isNaN(e))
        return res.status(400).json({ message: "Invalid end date" });
      match.createdAt = match.createdAt || {};
      match.createdAt.$lte = e;
    }

    const pipeline = [];
    if (Object.keys(match).length) pipeline.push({ $match: match });

    pipeline.push(
      {
        $group: {
          _id: "$category",
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1,
        },
      },
      { $sort: { total: -1 } },
    );

    const data = await Post.aggregate(pipeline);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Data range analytics (e.g., posts in last 7 days) can be added similarly by filtering posts based on createdAt field.
exports.postsByDateRange = async (req, res) => {
  try {
    const { start, end, author } = req.query;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "Please provide start and end dates" });
    }

    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s) || isNaN(e))
      return res.status(400).json({ message: "Invalid date(s) provided" });
    if (s > e)
      return res
        .status(400)
        .json({ message: "Start date must be before end date" });

    const match = {
      createdAt: { $gte: s, $lte: e },
    };

    if (author) {
      if (!mongoose.Types.ObjectId.isValid(author))
        return res.status(400).json({ message: "Invalid author id" });
      match.author = mongoose.Types.ObjectId(author);
    }

    const data = await Post.aggregate([
      { $match: match },
      // Group by category inside that range
      {
        $group: {
          _id: "$category",
          total: { $sum: 1 },
        },
      },

      // Clean output
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1,
        },
      },
    ]);

    res.json({ range: { start, end }, results: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
