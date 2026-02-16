# User CRUD Backend API

A RESTful API built with Express.js and MongoDB for managing user data with full CRUD operations and JWT authentication.

## Features

- ✅ **Authentication & Authorization** - JWT-based user registration and login
- ✅ **Password Security** - Bcrypt password hashing
- ✅ **Protected Routes** - Token-based route protection
- ✅ Create, Read, Update, and Delete users
- ✅ MongoDB integration with Mongoose
- ✅ Input validation using express-validator
- ✅ Error handling and proper HTTP status codes
- ✅ CORS enabled
- ✅ Environment variables configuration

## Technologies

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **express-validator** - Input validation

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Edit `.env` file with your settings:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/userdb
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
```

3. Make sure MongoDB is running on your system

## Running the Application

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

#### Register New User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": { ... }
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": { ... }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### User Management (All Protected - Require Authentication)

> [!IMPORTANT]
> All user CRUD endpoints require authentication. Include the JWT token in the Authorization header:
> `Authorization: Bearer YOUR_JWT_TOKEN`

### Get All Users
```
GET /api/users
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get User by ID
```
GET /api/users/:id
```

### Create New User
```
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

### Update User
```
PUT /api/users/:id
Content-Type: application/json

{
  "name": "John Updated",
  "age": 31
}
```

### Delete User
```
DELETE /api/users/:id
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "User created successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (in development mode)"
}
```

## User Schema

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | String | Yes | Max 50 characters |
| email | String | Yes | Valid email format, unique |
| password | String | Yes | Min 6 characters, hashed with bcrypt |
| age | Number | No | 0-120 |
| phone | String | No | - |
| address | Object | No | Contains street, city, state, zipCode, country |
| isActive | Boolean | No | Default: true |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

## Testing with cURL

### Authentication Flow

Register a user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"password123"}'
```

Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"password123"}'
```

**Save the token from the response!**

### Using Protected Endpoints

Get all users (requires token):
```bash
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Get current user:
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Get user by ID:
```bash
curl http://localhost:5000/api/users/USER_ID
```

Update user:
```bash
curl -X PUT http://localhost:5000/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -d '{"age":26}'
```

Delete user:
```bash
curl -X DELETE http://localhost:5000/api/users/USER_ID
```

## Project Structure

```
.
├── config/
│   └── db.js              # Database connection
├── controllers/
│   └── userController.js  # User CRUD operations
├── middleware/
│   └── validation.js      # Input validation rules
├── models/
│   └── User.js           # User schema
├── routes/
│   └── userRoutes.js     # API routes
├── .env                  # Environment variables
├── .gitignore
├── package.json
├── README.md
└── server.js             # Entry point
```

## License

ISC
