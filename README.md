# Express Authentication Service

A simple and secure user authentication API (Learning Project) built with Express.js and TypeScript, featuring JWT-based authentication, bcrypt password hashing, and protected routes.

## Features

- ✅ User registration with email validation
- ✅ Secure password hashing using bcrypt
- ✅ JWT token generation and verification
- ✅ Protected routes with middleware authentication
- ✅ Token expiration (1 hour)
- ✅ TypeScript support with full type safety
- ✅ Proper HTTP status codes
- ✅ JSON API responses

## Requirements

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone or navigate to the project directory:

```bash
cd express-authentication
```

2. Install dependencies:

```bash
npm install
```

3. Install TypeScript types for jsonwebtoken:

```bash
npm install --save-dev @types/jsonwebtoken
```

## Environment Setup

1. Create a `.env` file in the project root:

```bash
touch .env
```

2. Add the following variables to `.env`:

```env
AUTH_SECRET=your-super-secret-key-change-this
```

**Note:** For production, use a strong, random secret key.

## Project Structure

```
express-authentication/
├── src/
│   └── index.ts          # Main application file
├── .env                  # Environment variables (create this)
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### 1. Register User

**POST** `/register`

Creates a new user account.

**Request Body:**

```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
}
```

**Success Response (201):**

```json
{
    "success": true,
    "data": {
        "email": "john@example.com",
        "name": "John Doe",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

**Error Response (409):**

```json
{
    "success": false,
    "message": "User with this email already exist"
}
```

### 2. Login User

**POST** `/login`

Authenticates user credentials and returns a JWT token.

**Request Body:**

```json
{
    "email": "john@example.com",
    "password": "securePassword123"
}
```

**Success Response (200):**

```json
{
    "success": true,
    "data": {
        "email": "john@example.com",
        "name": "John Doe",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

**Error Responses:**

- **401** - User not found
- **401** - Incorrect credentials

### 3. Get User Profile

**GET** `/profile`

Retrieves the authenticated user's profile information.

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**

```json
{
    "success": true,
    "user": {
        "email": "john@example.com",
        "name": "John Doe",
        "iat": 1677000000,
        "exp": 1677003600
    }
}
```

**Error Response (401):**

```json
{
    "success": false,
    "message": "Unauthorized"
}
```

## Testing with curl

### Register a New User

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "myPassword456"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "myPassword456"
  }'
```

### Access Protected Profile Route

```bash
curl -X GET http://localhost:3000/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Testing with Postman

1. **Register Request:**
    - URL: `POST http://localhost:3000/register`
    - Body (JSON):
        ```json
        {
            "name": "Test User",
            "email": "test@example.com",
            "password": "test123"
        }
        ```

2. **Login Request:**
    - URL: `POST http://localhost:3000/login`
    - Body (JSON):
        ```json
        { "email": "test@example.com", "password": "test123" }
        ```
    - Copy the returned token

3. **Profile Request:**
    - URL: `GET http://localhost:3000/profile`
    - Headers:
        - Key: `Authorization`
        - Value: `Bearer <paste_your_token_here>`

## Technologies Used

- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **jsonwebtoken** - JWT generation and verification
- **bcrypt** - Password hashing

## Security Considerations

- Passwords are hashed with bcrypt (salt rounds: 10)
- JWT tokens expire after 1 hour
- Sensitive data (AUTH_SECRET) is stored in environment variables
- Protected routes require valid Bearer token authentication
- Proper HTTP status codes indicate different error scenarios

## License

MIT
