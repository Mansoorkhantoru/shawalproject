// fixCategories.js
const mongoose = require("mongoose");
const Product = require("./model/products");
require("dotenv").config();
const connect = require("./config/config");

const fixCategories = async () => {
  try {
    await connect();
    console.log("✅ Connected to database");
    
    // Get all products
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      let newCategory = "other";
      const name = product.name.toLowerCase();
      
      // Smart category assignment based on product name
      if (name.includes("phone") || name.includes("laptop") || name.includes("computer") || 
          name.includes("electronics") || name.includes("camera") || name.includes("tv") ||
          name.includes("speaker") || name.includes("headphone") || name.includes("earphone") ||
          name.includes("mobile") || name.includes("tablet") || name.includes("smartphone")) {
        newCategory = "electronics";
      } 
      else if (name.includes("shirt") || name.includes("dress") || name.includes("jeans") || 
               name.includes("fashion") || name.includes("cloth") || name.includes("shoe") ||
               name.includes("sneaker") || name.includes("jacket") || name.includes("t-shirt") ||
               name.includes("pant") || name.includes("shorts") || name.includes("hoodie")) {
        newCategory = "fashion";
      } 
      else if (name.includes("sofa") || name.includes("furniture") || name.includes("table") ||
               name.includes("chair") || name.includes("home") || name.includes("kitchen") ||
               name.includes("bed") || name.includes("lamp") || name.includes("decor")) {
        newCategory = "home";
      } 
      else if (name.includes("cream") || name.includes("makeup") || name.includes("beauty") ||
               name.includes("skin") || name.includes("hair") || name.includes("cosmetic") ||
               name.includes("face") || name.includes("lotion") || name.includes("perfume")) {
        newCategory = "beauty";
      } 
      else if (name.includes("ball") || name.includes("sports") || name.includes("gym") ||
               name.includes("fitness") || name.includes("bat") || name.includes("racket") ||
               name.includes("football") || name.includes("cricket") || name.includes("tennis")) {
        newCategory = "sports";
      } 
      else if (name.includes("book") || name.includes("story") || name.includes("novel") ||
               name.includes("magazine") || name.includes("textbook") || name.includes("comic")) {
        newCategory = "books";
      } 
      else if (name.includes("toy") || name.includes("game") || name.includes("play") ||
               name.includes("puzzle") || name.includes("doll") || name.includes("lego")) {
        newCategory = "toys";
      } 
      else if (name.includes("car") || name.includes("auto") || name.includes("vehicle") ||
               name.includes("tire") || name.includes("engine") || name.includes("parts")) {
        newCategory = "automotive";
      }
      
      // Update only if category is different
      if (product.category !== newCategory) {
        product.category = newCategory;
        await product.save();
        updatedCount++;
        console.log(`✅ Updated: ${product.name} -> ${newCategory}`);
      } else {
        console.log(`⏭️ Skipped: ${product.name} already has category: ${product.category}`);
      }
    }
    
    console.log(`\n✅ Updated ${updatedCount} products with correct categories!`);
    
    // Show final categories
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log("\n📊 Final category distribution:");
    categories.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} products`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

fixCategories();