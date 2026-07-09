// migrateCategories.js
const mongoose = require("mongoose");
const Product = require("./model/products");
require("dotenv").config();

// Connect to MongoDB
const connect = require("./config/config");
connect();

const migrateCategories = async () => {
  try {
    console.log("🔍 Checking products without category...");
    
    // Find all products
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} total products`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const product of products) {
      // Check if product has category field
      if (!product.category) {
        // Assign category based on product name
        let category = "other";
        const name = product.name.toLowerCase();
        
        // Electronics
        if (name.includes("phone") || name.includes("laptop") || name.includes("computer") || 
            name.includes("electronics") || name.includes("camera") || name.includes("tv") ||
            name.includes("speaker") || name.includes("headphone") || name.includes("earphone") ||
            name.includes("mobile") || name.includes("tablet") || name.includes("smartphone") ||
            name.includes("charger") || name.includes("cable") || name.includes("usb") ||
            name.includes("monitor") || name.includes("keyboard") || name.includes("mouse") ||
            name.includes("printer") || name.includes("scanner") || name.includes("router")) {
          category = "electronics";
        } 
        // Fashion
        else if (name.includes("shirt") || name.includes("dress") || name.includes("jeans") || 
                 name.includes("fashion") || name.includes("cloth") || name.includes("shoe") ||
                 name.includes("sneaker") || name.includes("jacket") || name.includes("t-shirt") ||
                 name.includes("pant") || name.includes("shorts") || name.includes("hoodie") ||
                 name.includes("sweater") || name.includes("coat") || name.includes("suit") ||
                 name.includes("tie") || name.includes("belt") || name.includes("wallet") ||
                 name.includes("sunglass") || name.includes("watch") || name.includes("jewelry")) {
          category = "fashion";
        } 
        // Home & Living
        else if (name.includes("sofa") || name.includes("furniture") || name.includes("table") ||
                 name.includes("chair") || name.includes("home") || name.includes("kitchen") ||
                 name.includes("bed") || name.includes("lamp") || name.includes("decor") ||
                 name.includes("pillow") || name.includes("blanket") || name.includes("curtain") ||
                 name.includes("carpet") || name.includes("mirror") || name.includes("clock") ||
                 name.includes("vase") || name.includes("pot") || name.includes("shelf")) {
          category = "home";
        } 
        // Beauty
        else if (name.includes("cream") || name.includes("makeup") || name.includes("beauty") ||
                 name.includes("skin") || name.includes("hair") || name.includes("cosmetic") ||
                 name.includes("face") || name.includes("lotion") || name.includes("perfume") ||
                 name.includes("lipstick") || name.includes("foundation") || name.includes("powder") ||
                 name.includes("serum") || name.includes("oil") || name.includes("shampoo") ||
                 name.includes("conditioner") || name.includes("soap") || name.includes("body")) {
          category = "beauty";
        } 
        // Sports
        else if (name.includes("ball") || name.includes("sports") || name.includes("gym") ||
                 name.includes("fitness") || name.includes("bat") || name.includes("racket") ||
                 name.includes("football") || name.includes("cricket") || name.includes("tennis") ||
                 name.includes("badminton") || name.includes("basketball") || name.includes("volleyball") ||
                 name.includes("yoga") || name.includes("dumbell") || name.includes("weight")) {
          category = "sports";
        } 
        // Books
        else if (name.includes("book") || name.includes("story") || name.includes("novel") ||
                 name.includes("magazine") || name.includes("textbook") || name.includes("comic") ||
                 name.includes("biography") || name.includes("poem") || name.includes("dictionary")) {
          category = "books";
        } 
        // Toys
        else if (name.includes("toy") || name.includes("game") || name.includes("play") ||
                 name.includes("puzzle") || name.includes("doll") || name.includes("lego") ||
                 name.includes("robot") || name.includes("car") && name.includes("toy") ||
                 name.includes("board") || name.includes("card") && name.includes("game")) {
          category = "toys";
        } 
        // Automotive
        else if (name.includes("car") || name.includes("auto") || name.includes("vehicle") ||
                 name.includes("tire") || name.includes("engine") || name.includes("parts") ||
                 name.includes("battery") || name.includes("motor") || name.includes("wheel")) {
          category = "automotive";
        }

        // Update the product
        product.category = category;
        await product.save();
        updatedCount++;
        console.log(`✅ Updated: ${product.name} -> ${category}`);
      } else {
        skippedCount++;
        console.log(`⏭️ Skipped: ${product.name} already has category: ${product.category}`);
      }
    }

    console.log("\n📊 Migration Summary:");
    console.log(`✅ Updated: ${updatedCount} products`);
    console.log(`⏭️ Skipped: ${skippedCount} products (already had category)`);
    console.log(`📦 Total: ${products.length} products`);
    
    console.log("\n✅ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during migration:", error);
    process.exit(1);
  }
};

migrateCategories();