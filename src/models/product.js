const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    stock_quantity: {
      type: Number,
      required: true,
      min: [0, "Stock Quantity cannot be negative"],
    },
    low_stock_threshold: {
      type: Number,
      required: true,
      default: 5,
      min: [0, "Threshold cannot be negative"],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
