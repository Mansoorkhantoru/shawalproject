const express = require("express");
const app = express();
const Product = require("./model/products");
const OrderPlace = require("./model/Order");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();
const connect = require("./config/config");

// Connect to database
connect();

const { upload, cloudinary } = require("./config/cloudinary");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_here";

// ====== HEALTH CHECK ======
app.get("/", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});


// ====== PRODUCT ROUTES ======

// Get all products
app.get("/allproduct", async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .lean()
      .limit(100);

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get specific product
app.get("/allproduct/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.json({ product });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Delete product
app.delete("/allproduct/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product Deleted" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add product - MODIFIED TO NOT REQUIRE CATEGORY
app.post("/addproduct", upload.single('image'), async (req, res) => {
  try {
    const { name, price, discountPrice, description, requiresPrescription } = req.body;
    let { category } = req.body;

    console.log("📥 Received product data:", { name, price, discountPrice, category });

    if (!name || !price || !discountPrice) {
      return res.status(400).json({
        message: "Please fill all required input (name, price, discountPrice)",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please Upload an image",
      });
    }

    // If category is not provided, set default
    if (!category) {
      category = "other";
    }

    const product = await Product.create({
      name,
      price,
      discountPrice,
      description,
      category,
      imageUrl: req.file.path || req.file.secure_url,
      publicId: req.file.filename || req.file.public_id,
      requiresPrescription: requiresPrescription === "true",
    });

    console.log("✅ Product saved:", product._id);

    res.json({
      success: true,
      message: "Successfully Added",
      product,
    });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get products by category
app.get("/products/category/:category", async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.category,
    })
      .sort({ createdAt: -1 })
      .lean()
      .limit(100);

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Category products error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get all categories with product counts
app.get("/categories", async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Categories error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== REVIEW ROUTES ======

// Add review
app.post("/product/:id/review", async (req, res) => {
  try {
    const { rating, comment, userId, userName } = req.body;

    if (!rating || !comment || !userId || !userName) {
      return res.status(400).json({
        success: false,
        message: "Please provide rating, comment, userId, and userName",
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const existingReviewIndex = product.ratings.findIndex(
      (r) => r.userId.toString() === userId
    );

    if (existingReviewIndex !== -1) {
      product.ratings[existingReviewIndex].rating = rating;
      product.ratings[existingReviewIndex].comment = comment;
      product.ratings[existingReviewIndex].userName = userName;
      product.ratings[existingReviewIndex].createdAt = new Date();
    } else {
      product.ratings.push({
        userId,
        rating,
        comment,
        userName,
        createdAt: new Date(),
      });
    }

    const totalRating = product.ratings.reduce((sum, r) => sum + r.rating, 0);
    product.averageRating = totalRating / product.ratings.length;
    product.totalRatings = product.ratings.length;

    await product.save();

    res.json({
      success: true,
      message: "Review added successfully",
      product,
    });
  } catch (error) {
    console.error("Review error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get reviews
app.get("/product/:id/reviews", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      ratings: product.ratings || [],
      averageRating: product.averageRating || 0,
      totalRatings: product.totalRatings || 0,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete review
app.delete("/product/:productId/review/:reviewId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.ratings = product.ratings.filter(
      (r) => r._id.toString() !== req.params.reviewId
    );

    if (product.ratings.length > 0) {
      const totalRating = product.ratings.reduce((sum, r) => sum + r.rating, 0);
      product.averageRating = totalRating / product.ratings.length;
    } else {
      product.averageRating = 0;
    }
    product.totalRatings = product.ratings.length;

    await product.save();

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ====== ORDER ROUTES ======

// Place order
app.post("/order", upload.single('prescription'), async (req, res) => {
  try {
    let { items, address, phone, email, name } = req.body;

    if (!items || !address || !phone) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    if (typeof items === "string") {
      items = JSON.parse(items);
    }

    let prescriptionRequired = false;
    for (const item of items) {
      const product = await Product.findById(item.productId).lean();
      if (product && product.requiresPrescription) {
        prescriptionRequired = true;
        break;
      }
    }

    if (prescriptionRequired && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Prescription is required for this order",
      });
    }

    const order = await OrderPlace.create({
      items,
      address,
      phone,
      email,
      name,
      prescription: req.file ? req.file.path || req.file.secure_url : null,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get all orders
app.get("/allorders", async (req, res) => {
  try {
    const orders = await OrderPlace.find()
      .sort({ createdAt: -1 })
      .lean()
      .limit(100);

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete order
app.delete("/allorders/:id", async (req, res) => {
  try {
    const deleteOrder = await OrderPlace.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Order Deleted", deleteOrder });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update order status
app.put("/allorders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await OrderPlace.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Admin login
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "12345") {
    return res.json({
      success: true,
      message: "Login successful",
    });
  }
  return res.status(401).json({
    success: false,
    message: "Invalid credentials",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});