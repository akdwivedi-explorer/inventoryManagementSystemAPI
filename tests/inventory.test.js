const request = require('supertest');
const app = require('../src/app');
const Product = require('../src/models/product');

describe('API Endpoints', () => {
  let product1;
  let product2;

  // Before each test, clear the database and create two sample products
  beforeEach(async () => {
    await Product.deleteMany({});
    product1 = await Product.create({
      name: 'Test Keyboard',
      description: 'A mechanical keyboard',
      stock_quantity: 10,
      low_stock_threshold: 5,
    });
    product2 = await Product.create({
      name: 'Low Stock Mouse',
      description: 'A mouse that is low on stock',
      stock_quantity: 3,
      low_stock_threshold: 5, // Note: stock is below the threshold
    });
  });

  //==================================================//
  //==         Product CRUD Endpoint Tests          ==//
  //==================================================//

  describe('Product CRUD Endpoints', () => {
    // Test suite for POST /api/products
    describe('POST /api/products', () => {
      it('should create a new product and return 201', async () => {
        const newProductData = {
          name: 'Webcam',
          description: 'A 1080p HD webcam',
          stock_quantity: 30,
        };
        const response = await request(app)
          .post('/api/products')
          .send(newProductData);

        expect(response.statusCode).toBe(201);
        expect(response.body.product).toHaveProperty('_id');
        expect(response.body.product.name).toBe('Webcam');
      });

      it('should return 400 if a required field is missing', async () => {
        const response = await request(app)
          .post('/api/products')
          .send({ description: 'Missing name and stock' });
        expect(response.statusCode).toBe(400);
      });
    });

    // Test suite for GET /api/products
    describe('GET /api/products', () => {
      it('should retrieve all products and return 200', async () => {
        const response = await request(app).get('/api/products');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body.products)).toBe(true);
        expect(response.body.products.length).toBe(2);
      });
    });

    // Test suite for GET /api/products/:id
    describe('GET /api/products/:id', () => {
      it('should retrieve a single product by its ID and return 200', async () => {
        const response = await request(app).get(`/api/products/${product1._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.product.name).toBe(product1.name);
      });

      it('should return 404 for a non-existent product ID', async () => {
        const nonExistentId = '60d5ec49f71c4c001f5e8a00';
        const response = await request(app).get(`/api/products/${nonExistentId}`);
        expect(response.statusCode).toBe(404);
      });
    });

    // Test suite for PATCH /api/products/:id
    describe('PATCH /api/products/:id', () => {
      it('should update a product and return 200', async () => {
        const updates = {
          name: 'Upgraded Keyboard',
          stock_quantity: 45,
        };
        const response = await request(app)
          .patch(`/api/products/${product1._id}`)
          .send(updates);

        expect(response.statusCode).toBe(200);
        expect(response.body.product.name).toBe('Upgraded Keyboard');
        expect(response.body.product.stock_quantity).toBe(45);
      });
    });

    // Test suite for DELETE /api/products/:id
    describe('DELETE /api/products/:id', () => {
      it('should delete a product and return 200', async () => {
        const response = await request(app).delete(`/api/products/${product1._id}`);
        expect(response.statusCode).toBe(200);

        const verifyResponse = await request(app).get(`/api/products/${product1._id}`);
        expect(verifyResponse.statusCode).toBe(404);
      });
    });

    // Test suite for GET /api/products/stock/low
    describe('GET /api/products/stock/low', () => {
      it('should retrieve only products below their low stock threshold', async () => {
        const response = await request(app).get('/api/products/stock/low');
        expect(response.statusCode).toBe(200);
        expect(response.body.products.length).toBe(1);
        expect(response.body.products[0].name).toBe('Low Stock Mouse');
      });
    });
  });

  //==================================================//
  //==        Inventory Endpoint Tests              ==//
  //==================================================//

  describe('Inventory Endpoints', () => {
    // Test suite for increasing stock
    describe('PATCH /api/products/:id/increase-stock', () => {
      it('should increase the product stock quantity and return 200', async () => {
        const response = await request(app)
          .patch(`/api/products/${product1._id}/increase-stock`)
          .send({ stock: 5 });

        expect(response.statusCode).toBe(200);
        expect(response.body.product.stock_quantity).toBe(15);
      });

      it('should return 400 for a non-positive stock value', async () => {
        const response = await request(app)
          .patch(`/api/products/${product1._id}/increase-stock`)
          .send({ stock: -5 });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Stock must be a positive number!');
      });
    });

    // Test suite for decreasing stock
    describe('PATCH /api/products/:id/decrease-stock', () => {
      it('should decrease the product stock quantity and return 200', async () => {
        const response = await request(app)
          .patch(`/api/products/${product1._id}/decrease-stock`)
          .send({ stock: 7 });

        expect(response.statusCode).toBe(200);
        expect(response.body.product.stock_quantity).toBe(3);
      });

      it('should return 400 if trying to decrease stock below zero', async () => {
        const response = await request(app)
          .patch(`/api/products/${product1._id}/decrease-stock`)
          .send({ stock: 15 });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toContain('Insufficient stock');
      });

      it('should return 404 for a non-existent product ID', async () => {
        const nonExistentId = '60d5ec49f71c4c001f5e8a00';
        const response = await request(app)
          .patch(`/api/products/${nonExistentId}/decrease-stock`)
          .send({ stock: 5 });
        expect(response.statusCode).toBe(404);
      });
    });
  });
});