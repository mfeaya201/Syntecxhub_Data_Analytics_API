require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Post = require("../models/Post");
const connectDB = require("../config/db");

connectDB();

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});

    // Create sample users
    const users = await User.insertMany([
      { name: "Ayakha", email: "ayamfe@gmail.com" },
      { name: "Bob", email: "bob@gmail.com" },
      { name: "Liyo", email: "liyo@gmail.com" },
    ]);

    // Create sample posts with varied createdAt dates (spanning several months)
    const posts = [
      {
        title: "First Post",
        body: "This is the first post",
        author: users[0]._id,
        category: "General",
        createdAt: new Date("2023-12-31T10:00:00Z"),
      },
      {
        title: "New Year Thoughts",
        body: "Reflections for the new year",
        author: users[0]._id,
        category: "General",
        createdAt: new Date("2024-01-05T09:00:00Z"),
      },
      {
        title: "Tech Deep Dive",
        body: "Exploring Node.js",
        author: users[1]._id,
        category: "Tech",
        createdAt: new Date("2024-01-15T12:00:00Z"),
      },
      {
        title: "Frontend Trends",
        body: "CSS and modern UI",
        author: users[1]._id,
        category: "Tech",
        createdAt: new Date("2024-02-20T14:30:00Z"),
      },
      {
        title: "Weekend Read",
        body: "Lifestyle tips",
        author: users[2]._id,
        category: "Lifestyle",
        createdAt: new Date("2024-02-25T08:15:00Z"),
      },
      {
        title: "March Updates",
        body: "What changed this month",
        author: users[0]._id,
        category: "General",
        createdAt: new Date("2024-03-05T11:00:00Z"),
      },
      {
        title: "Deep Learning",
        body: "Notes on ML",
        author: users[1]._id,
        category: "Tech",
        createdAt: new Date("2024-03-18T16:00:00Z"),
      },
      {
        title: "Healthy Habits",
        body: "Daily routine",
        author: users[2]._id,
        category: "Lifestyle",
        createdAt: new Date("2024-01-22T07:45:00Z"),
      },
      {
        title: "Another General Post",
        body: "Misc updates",
        author: users[0]._id,
        category: "General",
        createdAt: new Date("2024-02-01T10:30:00Z"),
      },
      {
        title: "Tech Wrap",
        body: "End of month tech summary",
        author: users[1]._id,
        category: "Tech",
        createdAt: new Date("2024-02-28T19:00:00Z"),
      },
    ];

    await Post.insertMany(posts);

    console.log("Data Seeded Successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding Error:", error.message);
    process.exit(1);
  }
};

seedData();
