const express = require("express");
const {
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProductById,
  deleteAllProduct,
  createProduct,
} = require("../controllers/productController");

const {
  increaseStockQuantity,
  decreaseStockQuantity,
  getLowStockProducts,
} = require("../controllers/inventoryController");

const router = express.Router();

router.get("/products", getAllProducts);
router.get("/products/stock/low", getLowStockProducts);
router.get("/products/:id", getProductById);
router.post("/products", createProduct);
router.patch("/products/:id", updateProduct);
router.delete("/products/:id", deleteProductById);
router.delete("/products", deleteAllProduct);

router.patch("/products/:id/increase-stock", increaseStockQuantity);
router.patch("/products/:id/decrease-stock", decreaseStockQuantity);

module.exports = router;
