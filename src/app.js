const express = require("express");
const productRouter = require("./routes/productRoutes");

const app = express();

app.use(express.json());

app.use("/api", productRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found!" });
});

module.exports = app;
