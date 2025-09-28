const request = require('supertest');
const app = require('../src/app'); // Import your express app
const Product = require('../src/models/product'); // Import your Product model

// Group tests for inventory endpoints
describe('Inventory Endpoints', () => {
  let product;

  // Before each test, create a sample product
  beforeEach(async () => {
    product = await Product.create({
      name: 'Test Keyboard',
      description: 'A mechanical keyboard',
      stock_quantity: 10,
      low_stock_threshold: 5,
    });
  });

  // Test suite for increasing stock
  describe('PATCH /api/products/:id/increase-stock', () => {
    it('should increase the product stock quantity and return 200', async () => {
      const response = await request(app)
        .patch(`/api/products/${product._id}/increase-stock`)
        .send({ stock: 5 }); // Send the amount to increase

      expect(response.statusCode).toBe(200);
      expect(response.body.product.stock_quantity).toBe(15);
    });

    it('should return 400 for a non-positive stock value', async () => {
      const response = await request(app)
        .patch(`/api/products/${product._id}/increase-stock`)
        .send({ stock: -5 });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Stock must be a positive number!');
    });
  });

  // Test suite for decreasing stock
  describe('PATCH /api/products/:id/decrease-stock', () => {
    it('should decrease the product stock quantity and return 200', async () => {
      const response = await request(app)
        .patch(`/api/products/${product._id}/decrease-stock`)
        .send({ stock: 7 });

      expect(response.statusCode).toBe(200);
      expect(response.body.product.stock_quantity).toBe(3);
    });

    // This is the critical edge case from your requirements
    it('should return 400 if trying to decrease stock below zero', async () => {
      const response = await request(app)
        .patch(`/api/products/${product._id}/decrease-stock`)
        .send({ stock: 15 }); // Trying to remove more than available

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain('Insufficient stock');
    });

    it('should return 404 for a non-existent product ID', async () => {
      const nonExistentId = '60d5ec49f71c4c001f5e8a00'; // A valid but non-existent Mongo ID
      const response = await request(app)
        .patch(`/api/products/${nonExistentId}/decrease-stock`)
        .send({ stock: 5 });

      expect(response.statusCode).toBe(404);
    });
  });
});