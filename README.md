## Inventory Management System API 
A robust backend-heavy API built with Node.js, Express, and MongoDB to track and manage products in a warehouse. This project features full CRUD functionality for products and intelligent inventory logic to handle stock updates safely and efficiently.

## Core Features 
Product Management: Full CRUD (Create, Read, Update, Delete) endpoints for products.

* **Atomic Stock Operations:** Safely increase or decrease product stock with logic that prevents race conditions and ensures data integrity.
* **Inventory Validation:** Business logic to prevent stock quantities from ever going below zero.
* **Low Stock Alerts:** An endpoint to quickly identify all products that have fallen below their specified low-stock threshold.
* **Unit & Integration Testing:** A complete test suite using Jest and an in-memory database to validate the API's business logic.

## Tech Stack
* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose ODM
* **Testing:** Jest, Supertest, MongoDB-in-memory-server

## Getting Started
Follow these instructions to get the project set up and running on your local machine.

## Prerequisites

Make sure you have the following installed:

* Node.js (v14 or newer)
* npm
* MongoDB (for local development database)

## Installation & Setup

Clone the repository:

```Bash
git clone <your-repository-link>
cd <repository-name>
```

Install dependencies:

```Bash
npm install
```

Set up environment variables:
Create a file named .env in the root of the project and add the following variables. Replace the placeholder with your own MongoDB connection string.
```
MONGO_URI="mongodb://localhost:27017/inventoryDB"
PORT=5000
```
## Running the Application 

To start the server, run the following command:

```Bash
npm start
```

The API will be available at ```http://localhost:5000.```

## Running the Test Cases 

To run the automated tests, use the following command. The tests use an in-memory MongoDB instance and do not require a separate database connection.

```Bash
npm test
```

## API Endpoints
All endpoints are prefixed with ```/api```</br>

| Method | Endpoint                          | Description                               |
|--------|-----------------------------------|-------------------------------------------|
| POST   | /products                         | Creates a new product.                     |
| GET    | /products                         | Retrieves a list of all products.          |
| GET    | /products/stock/low               | Retrieves products below their stock threshold. |
| GET    | /products/:id                     | Retrieves a single product by its ID.      |
| PATCH  | /products/:id                     | Updates a product's details.               |
| DELETE | /products/:id                     | Deletes a product by its ID.               |
| PATCH  | /products/:id/increase-stock      | Increases the stock of a specific product. |
| PATCH  | /products/:id/decrease-stock      | Decreases the stock of a specific product. |



## Assumptions & Design Choices
* RESTful API Design: The API is structured following REST principles, with endpoints grouped by the "product" resource. Actions like increasing stock are handled as sub-resources (/products/:id/increase-stock) for clarity.
* Atomic Operations: To prevent race conditions during concurrent stock updates, the system uses atomic MongoDB operations ($inc, findOneAndUpdate with query conditions) instead of a "read-then-write" pattern. This ensures that the database is the single source of truth and maintains data integrity.
* Data Validation: Business rules, such as preventing negative stock, are enforced at the database schema level using Mongoose validators. This provides a robust and centralized layer of data validation.
* Isolated Testing Environment: Tests are designed to be self-contained and reliable by using an in-memory MongoDB server. This ensures that running tests does not affect any development data and provides a fresh, predictable state for each test run.
