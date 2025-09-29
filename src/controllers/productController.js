const Product = require("../models/product");

const createProduct = async (req, res) => {
  try {
    const { name, description, stock_quantity, low_stock_threshold } = req.body;

    const newProduct = new Product({ name, description, stock_quantity, low_stock_threshold });
    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product created successfully!", product: newProduct });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({
      message: "Server error while creating product",
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find();
    res.status(200).json({ products: allProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while fetching products",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    res.status(200).json({ product: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while fetching product",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updates = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.description !== undefined)
      updates.description = req.body.description;
    if (req.body.stock_quantity !== undefined)
      updates.stock_quantity = req.body.stock_quantity;
    if(req.body.low_stock_threshold !== undefined)
        updates.low_stock_threshold = req.body.low_stock_threshold;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found!" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, update failed" });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found!" });
    }

    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error!" });
  }
};

const deleteAllProduct = async (req, res) => {
  try {
    const { confirm } = req.query;

    if (confirm !== "true") {
      return res.status(400).json({
        message: "Please confirm deletion by sending '?confirm=true' in query",
      });
    }

    const result = await Product.deleteMany();
    res.status(200).json({
      message: "All products deleted successfully!",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error while deleting all products",
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProductById,
  deleteAllProduct,
};
