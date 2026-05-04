const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma");
const authMiddleware = require('../middleware/auth');

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

// DELETE category
router.delete('/:id', authMiddleware, async (req, res) => {
  await prisma.category.delete({
    where: { id: parseInt(req.params.id) },
  });
  res.json({ message: 'Category deleted' });
});

module.exports = router;