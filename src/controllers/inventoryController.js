const Product = require("../models/product");

const increaseStockQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (typeof stock !== "number" || stock <= 0) {
      return res
        .status(400)
        .json({ message: "Stock must be a positive number!" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $inc: { stock_quantity: stock } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found!!" });
    }

    res.status(200).json({
      message: "Stock quantity increased successfully!!",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error while increasing stock quantity!",
    });
  }
};

const decreaseStockQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (typeof stock !== "number" || stock <= 0) {
      return res
        .status(400)
        .json({ message: "Stock must be a positive number!" });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, stock_quantity: { $gte: stock } },
      { $inc: { stock_quantity: -stock } },
      { new: true }
    );

    if (!updatedProduct) {
      const productExists = await Product.exists({ _id: id });
      if (!productExists) {
        return res.status(404).json({ message: "Product not found!" });
      }
      return res.status(400).json({
        message:
          "Insufficient stock. Cannot decrease below available quantity.",
      });
    }

    res.status(200).json({
      message: "Stock quantity decreased successfully!",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error while decreasing stock quantity!",
    });
  }
};

const getLowStockProducts = async (req, res) => {
  try {
    const lowStockProducts = await Product.find({
      $expr: { $lt: ["$stock_quantity", "$low_stock_threshold"] },
    });

    res.status(200).json({ products: lowStockProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while fetching low stock products",
    });
  }
};

module.exports = {
  increaseStockQuantity,
  decreaseStockQuantity,
  getLowStockProducts,
};
