const express = require("express");
const router = express.Router();
const multer = require("multer");
const prisma = require("../lib/prisma");
const cloudinary = require("../lib/cloudinary");

const upload = multer({ storage: multer.memoryStorage() });

// GET all products
router.get("/", async (req, res) => {
  const { category } = req.query;
  const products = await prisma.product.findMany({
    where: category ? { category: { slug: category } } : {},
    include: { images: true, category: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(products);
});

// GET single product
router.get("/:slug", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { slug: req.params.slug },
    include: { images: true, category: true },
  });
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

// POST create product with image
router.post("/", upload.single("image"), async (req, res) => {
  const { name, description, price, slug, categoryId, inStock } = req.body;

  let imageData = null;

  if (req.file) {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "nk-aroma" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(req.file.buffer);
    });

    imageData = { url: result.secure_url, publicId: result.public_id, isPrimary: true };
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      slug,
      inStock: inStock === "true",
      categoryId: categoryId ? parseInt(categoryId) : null,
      images: imageData ? { create: imageData } : undefined,
    },
    include: { images: true, category: true },
  });

  res.status(201).json(product);
});

// DELETE product
router.delete("/:id", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { images: true },
  });

  if (!product) return res.status(404).json({ error: "Product not found" });

  // Delete images from Cloudinary
  for (const image of product.images) {
    await cloudinary.uploader.destroy(image.publicId);
  }

  await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ message: "Product deleted" });
});

module.exports = router;