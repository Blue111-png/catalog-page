const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma");

// GET all categories
router.get("/", async (req, res) => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  });
  res.json(categories);
});

// POST create category
router.post("/", async (req, res) => {
  const { name, slug } = req.body;
  const category = await prisma.category.create({
    data: { name, slug },
  });
  res.status(201).json(category);
});

module.exports = router;