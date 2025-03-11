<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Marketplace MS

This microservice was created with Nest JS with the idea to demostrate how a little example of e-commerce works, managing products, users and their roles. Also this can be integrated with websites made with Angular, React, Vue and others frontend technologies.

## Features
- Usage of JWT to create user session with time expiration
- Implemented Guards validations to avoid unauthorized executions
- TypeORM in this project allows make queries and migrations to the database

## Previous Requirements
- Node JS Installed, because this is a JS project and you need to install packages to run it
- PostgreSQL installed in your computer or a remote access, you'll need to create a database named `marketplace` and copy the URI into .env file
- Visual Studio Code or any other code editor to see the project and execute this in the terminal
- Nest CLI instaled (optional)

## Installation
1. Clone this repository in a specific localtion in your computer
2. Create a database named `marketplace` through DBeaver, PgAdmin or with command interpreter from PostgreSQL
3. Create a .env file and add the following variables accoding your database connection
```dotenv
DATABASE_URL=postgres://<your-user>:@localhost:5432/marketplace
NODE_ENV=development
```
4. Go to project folder and install packages with the next command:
```bash
npm install
```

5. Finally, run project with the next commands
```bash
# Run project with NPM
npm run start:dev
# Or run project with Nest CLI
nest start --watch
```

## API Usage
```bash
# Local server
http://localhost:3000
```

### Auth - Login user
Allows user access to marketplace depending their role
- Endpoint: `/auth/login`
- Type: `POST`
- Query: N/A
- Params: N/A
- Body:
```json
{
  "username": "yourusername",
  "password": "yourpassword"
}
```
#### Success
- Status: `200`
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...",
    "id": "1",
    "role": "seller"
}
```

#### Failure
- Status: `401`
```json
{
    "message": "Unauthorized",
    "statusCode": 401
}
```

### Auth - Register a new user
Allows user create their account
- Endpoint: `/auth/register`
- Type: `POST`
- Query: N/A
- Params: N/A
- Body:
```json
{
    "username": "yourusername",
    "password": "yourpassword",
    "role": "buyer"
}
```

#### Success
- Status: `201`
```json
{
    "id": "1",
    "username": "new-buyer",
    "role": "buyer",
    "createdAt": "2025-03-10T20:31:49.974Z",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9k..."
}
```

#### Failure
- Status: `409`
```json
{
    "message": "Username already exists",
    "error": "Conflict",
    "statusCode": 409
}
```

### Auth - User status
Show user main info, you need to be logged in
- Endpoint: `/auth/GET`
- Type: `POST`
- Query: N/A
- Params: N/A
- Body: N/A

#### Success
- Status: `200`
```json
{
    "id": "1",
    "username": "youruser",
    "role": "seller",
    "createdAt": "2025-03-08T14:13:10.562Z",
    "iat": 1741639172,
    "exp": 1741811972
}
```

#### Failure
- Status: `401`
```json
{
    "message": "Unauthorized",
    "statusCode": 401
}
```

### Users - Get all users
Retrieves a list of registered users
- Endpoint: `/users`
- Type: `GET`
- Query: N/A
- Params: N/A
- Body: N/A

#### Success
- Status: `200`
```json
[
    {
        "id": "1",
        "username": "user-seller",
        "password": "$2b$10$cz7xzMu55sy0mGJfs6T...",
        "role": "seller",
        "createdAt": "2025-03-08T14:13:10.562Z"
    },
    {
        "id": "2",
        "username": "user-admin",
        "password": "$2b$10$boA5AiVVNkxsNZXps//...",
        "role": "admin",
        "createdAt": "2025-03-08T19:05:11.385Z"
    },
    {
        "id": "3",
        "username": "user-buyer",
        "password": "$2b$10$SDSpqzi/1HL5o2fzS9h...",
        "role": "buyer",
        "createdAt": "2025-03-08T19:05:19.409Z"
    }
]
```

#### Failure
- Status: `401`
```json
{
    "message": "Unauthorized",
    "statusCode": 401
}
```

### Users - Get a user
Retrieves a unique user by their id
- Route: `/users/:id`
- Type: `GET`
- Query: N/A
- Params: N/A
- Body: N/A

#### Success
- Status: `200`
```json
{
    "id": "1",
    "username": "user-seller",
    "password": "$2b$10$cz7xzMu55sy0mGJfs6T...",
    "role": "seller",
    "createdAt": "2025-03-08T14:13:10.562Z"
}
```

#### Failure
- Status: `401`
```json
{
    "message": "Unauthorized",
    "statusCode": 401
}
```

- Status: `404`
```json
{
    "message": "User with id 13 not found",
    "error": "Not Found",
    "statusCode": 404
}
```


### Users - Update user info
Allow change user's information
- Endpoint: `/users/:id`
- Type: `PUT`
- Query: N/A
- Params: `id`
- Body: 
```json
{
    "username": "update-username",
    "password": "update-password"
}
```

#### Success
- Status: `200`
```json
{
    "message": "User updated successfully"
}
```

#### Failure
- Status: `401`
```json
{
    "message": "Unauthorized",
    "statusCode": 401
}
```

### Users - Delete a user
Allows delete an account by their id
- Endpoint: `/users/:id`
- Type: `DELETE`
- Query: N/A
- Params: `id`
- Body: N/A

#### Success
- Status: `200`
```json
{
    "message": "User deleted successfully"
}
```

#### Failure
- Status: `401`
```json
{
    "message": "Unauthorized",
    "statusCode": 401
}
```

### Products - Get all products
Retrives all stored products
- Route: `/products`
- Type: `GET`
- Query: N/A
- Params: N/A
- Body: N/A

#### Success
- Status: `200`
```json
[
    {
        "id": 1,
        "sku": "product-abcde",
        "name": "Product 1",
        "price": 150,
        "quantity": 5,
        "image_url": "https://example-image.com",
        "createdAt": "2025-03-08T14:15:51.721Z",
        "updatedAt": "2025-03-08T18:19:12.772Z",
        "ownerUsername": "user-seller"
    },
    {
        "id": 2,
        "sku": "product-fghij",
        "name": "Product 2",
        "price": 150,
        "quantity": 5,
        "image_url": "https://example-image.com",
        "createdAt": "2025-03-08T14:15:51.721Z",
        "updatedAt": "2025-03-08T18:19:12.772Z",
        "ownerUsername": "user-seller"
    },
]
```

#### Failure
- Status: `401`
```json
{
    "message": "Unauthorized",
    "statusCode": 401
}
```

### Products - Create a Product
Create a new product from a seller
- Route: `/products`
- Type: `POST`
- Query: N/A
- Params: N/A
- Body:
```json
{
    "sku": "product-fghij",
    "name": "Product 2",
    "price": 150,
    "quantity": 5,
    "imageUrl": "https://example-image.com",
    "ownerId": 1
}
```

#### Success
- Status: `201`
```json
{
    "id": 100,
    "sku": "product-fghij",
    "name": "Product 2",
    "price": 150,
    "quantity": 5,
    "image_url": "https://example-image.com",
    "createdAt": "2025-03-11T02:44:25.494Z",
    "updatedAt": "2025-03-11T02:44:25.494Z",
    "owner": {
        "id": "1",
        "username": "user-seller",
        "password": "$2b$10$boA5AiVVNkxsNZXps//...",
        "role": "seller",
        "createdAt": "2025-03-08T14:13:10.562Z"
    }
}
```

#### Failure
- Status: `401`
```json
{
    "message": "Unauthorized",
    "statusCode": 401
}
```

### Products - Get a Product
Retrieve info from a product
- Route: `/products/:id`
- Type: `GET`
- Query: N/A
- Params: `id`
- Body: N/A

- Status: `200`
```json
{
    "id": 100,
    "sku": "product-fghij",
    "name": "Product 2",
    "price": 150,
    "quantity": 5,
    "image_url": "https://example-image.com",
    "createdAt": "2025-03-11T02:44:25.494Z",
    "updatedAt": "2025-03-11T02:44:25.494Z",
}
```

- Status: `401`
```json
{
    "message": "Unauthorized",
    "statusCode": 401
}
```

### Products - Update a Product
Changes values from a product
- Route: `/products/:id`
- Type: `PUT`
- Query: N/A
- Params: `id`
- Body:
```json
{
    "sku": "product-fghij",
    "name": "Product 2",
    "price": 155,
    "quantity": 10,
    "image_url": "https://example-image.com"
}
```

#### Success
- Status: `200`
```json
{
    "message": "Product updated successfully"
}
```

#### Failure
- Status: `401`
```json
{
    "message": "Unauthorized",
    "statusCode": 401
}
```

### Products - Delete a product
Allows delete a product by their id
- Route: `/products/:id`
- Type: `DELETE`
- Query: N/A
- Params: `id`
- Body: N/A

#### Success
- Status: `200`
```json
{
    "message": "Product deleted successfully"
}
```

#### Failure
- Status: `401`
```json
{
    "message": "Unauthorized",
    "statusCode": 401
}
```

### Products - Buy Products
Sends a list products ids and quantity to be purchased
- Route: `/products/buy`
- Type: `POST`
- Query: N/A
- Params: N/A
- Body:
```json
{
    "items": [
        {
            "productId": 2,
            "quantity": 1
        },
        {
            "productId": 3,
            "quantity": 2
        }
    ]
}
```

#### Success
- Status: `200`
```json
{
    "message": "Products purchased successfully",
    "products": [
        {
            "id": 2,
            "sku": "product-fghij",
            "name": "Product 2",
            "price": 159,
            "quantity": 8,
            "image_url": "https://i.postimg.cc/DfxvCJcK/apple-airpods.jpg",
            "createdAt": "2025-03-08T21:49:52.067Z",
            "updatedAt": "2025-03-08T21:49:52.067Z"
        },
        {
            "id": 3,
            "sku": "product-klmnop",
            "name": "Product 3",
            "price": 29,
            "quantity": 12,
            "image_url": "https://i.postimg.cc/d0GQn55W/apple-black-case.jpg",
            "createdAt": "2025-03-08T22:01:48.983Z",
            "updatedAt": "2025-03-08T22:01:48.983Z"
        }
    ]
}
```

#### Failure
- Status: `401`
```json
{
    "message": "Unauthorized",
    "statusCode": 401
}
```
### Products - Search Products with filters
Retrieves a list of products corresponding to the filter applied
- Route: `products/search`
- Type: `GET`
- Query: `q`, `ownerId`
- Params: N/A
- Body: N/A

#### Success
- Status: `200`

```json
[
    {
        "id": 2,
        "sku": "product-fghij",
        "name": "Product 2",
        "price": 159,
        "quantity": 8,
        "image_url": "https://i.postimg.cc/DfxvCJcK/apple-airpods.jpg",
        "createdAt": "2025-03-08T21:49:52.067Z",
        "updatedAt": "2025-03-08T21:49:52.067Z"
    },
    {
        "id": 3,
        "sku": "product-klmnop",
        "name": "Product 3",
        "price": 29,
        "quantity": 12,
        "image_url": "https://i.postimg.cc/d0GQn55W/apple-black-case.jpg",
        "createdAt": "2025-03-08T22:01:48.983Z",
        "updatedAt": "2025-03-08T22:01:48.983Z"
    }
]
```

### Products - Get products from owners
Retrieves a list of product accoding to a list of owners ids
- Route: `/products/owners`
- Type: `GET`
- Query: `ids` (numbers separated by comma)
- Params: N/A
- Body: N/A

#### Success
- Status: `200`

```json
[
    {
        "id": 2,
        "sku": "product-fghij",
        "name": "Product 2",
        "price": 159,
        "quantity": 8,
        "image_url": "https://i.postimg.cc/DfxvCJcK/apple-airpods.jpg",
        "createdAt": "2025-03-08T21:49:52.067Z",
        "updatedAt": "2025-03-08T21:49:52.067Z"
    },
    {
        "id": 3,
        "sku": "product-klmnop",
        "name": "Product 3",
        "price": 29,
        "quantity": 12,
        "image_url": "https://i.postimg.cc/d0GQn55W/apple-black-case.jpg",
        "createdAt": "2025-03-08T22:01:48.983Z",
        "updatedAt": "2025-03-08T22:01:48.983Z"
    }
]
```

#### Failure
- Status: `401`
```json
{
    "message": "Unauthorized",
    "statusCode": 401
}
```

- Status: `500`
```json
{
    "statusCode": 500,
    "message": "Internal server error"
}
```

