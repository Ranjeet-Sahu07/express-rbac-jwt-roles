# Express RBAC JWT Roles

## Overview

A comprehensive Node.js + Express.js backend demonstrating **Role-Based Access Control (RBAC)** using **JWT authentication** with three distinct roles:
- **Admin** - Full system access
- **Moderator** - Content management access
- **User** - Basic profile access

## Features

✅ JWT-based authentication
✅ Role-based authorization middleware
✅ Three user roles with different permissions
✅ Protected routes based on user roles
✅ Secure token verification
✅ Proper error handling (401, 403, 500)
✅ Clean and modular code structure

## Project Structure

```
express-rbac-jwt-roles/
├── server.js                    # Main server file
├── middleware/
│   ├── authMiddleware.js        # JWT verification middleware
│   └── roleMiddleware.js        # Role-based authorization
├── routes/
│   ├── authRoutes.js            # Login route
│   └── protectedRoutes.js       # Role-protected routes
├── .env                          # Environment variables
├── .gitignore                    # Git ignore file
├── package.json                  # Project dependencies
└── README.md                     # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Step 1: Clone the Repository

```bash
git clone https://github.com/Ranjeet-Sahu07/express-rbac-jwt-roles.git
cd express-rbac-jwt-roles
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web framework
- `jsonwebtoken` - JWT implementation
- `body-parser` - Request body parsing
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory (already included):

```env
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
PORT=5000
```

**Important:** Change the `JWT_SECRET` in production!

### Step 4: Start the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### 1. Root Endpoint

**GET** `/`

Returns API information and available endpoints.

**Response:**
```json
{
  "message": "Welcome to Express RBAC JWT API",
  "endpoints": {
    "login": "POST /api/auth/login",
    "admin": "GET /api/admin/dashboard",
    "moderator": "GET /api/moderator/manage",
    "user": "GET /api/user/profile"
  }
}
```

### 2. Authentication

#### Login

**POST** `/api/auth/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Hardcoded Users:**

| Username   | Password  | Role      |
|------------|-----------|----------|
| admin      | admin123  | admin    |
| moderator  | mod123    | moderator|
| user       | user123   | user     |

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

**Error Response (401):**
```json
{
  "message": "Unauthorized",
  "error": "Invalid username or password"
}
```

### 3. Protected Routes

All protected routes require the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

#### Admin Dashboard

**GET** `/api/admin/dashboard`

**Access:** Admin only

**Success Response (200):**
```json
{
  "message": "Welcome to Admin Dashboard",
  "user": {
    "username": "admin",
    "role": "admin"
  },
  "data": {
    "description": "This is a protected route accessible only by Admin users",
    "adminFeatures": [
      "User Management",
      "System Configuration",
      "Full Access"
    ]
  }
}
```

#### Moderator Management

**GET** `/api/moderator/manage`

**Access:** Moderator and Admin

**Success Response (200):**
```json
{
  "message": "Welcome to Moderator Management Panel",
  "user": {
    "username": "moderator",
    "role": "moderator"
  },
  "data": {
    "description": "This route is accessible by Moderators and Admins",
    "features": [
      "Content Moderation",
      "User Reports",
      "Community Management"
    ]
  }
}
```

#### User Profile

**GET** `/api/user/profile`

**Access:** All authenticated users (user, moderator, admin)

**Success Response (200):**
```json
{
  "message": "Welcome to User Profile",
  "user": {
    "username": "user",
    "role": "user"
  },
  "data": {
    "description": "This route is accessible by any authenticated user",
    "features": [
      "View Profile",
      "Edit Settings",
      "View Dashboard"
    ]
  }
}
```

## Testing with Postman

### Step 1: Login to Get Token

1. **Method:** POST
2. **URL:** `http://localhost:5000/api/auth/login`
3. **Headers:** `Content-Type: application/json`
4. **Body (raw JSON):**
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
5. **Copy the returned `token` from the response**

### Step 2: Access Protected Routes

1. **Method:** GET
2. **URL:** `http://localhost:5000/api/admin/dashboard`
3. **Headers:**
   - `Authorization: Bearer <paste_your_token_here>`

### Step 3: Test Different Scenarios

| User Type | Can Access `/admin/dashboard` | Can Access `/moderator/manage` | Can Access `/user/profile` |
|-----------|-------------------------------|--------------------------------|---------------------------|
| Admin     | ✅ Yes                        | ✅ Yes                         | ✅ Yes                    |
| Moderator | ❌ No (403 Forbidden)         | ✅ Yes                         | ✅ Yes                    |
| User      | ❌ No (403 Forbidden)         | ❌ No (403 Forbidden)          | ✅ Yes                    |

## Error Responses

### 400 Bad Request
```json
{
  "message": "Bad Request",
  "error": "Username and password are required"
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized: No token provided",
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "message": "Forbidden: Access denied",
  "error": "You do not have permission to access this resource. Required roles: admin",
  "userRole": "user"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error",
  "error": "Error details..."
}
```

## How It Works

### 1. Authentication Flow

1. User sends credentials to `/api/auth/login`
2. Server validates credentials against hardcoded users
3. If valid, server generates JWT token with user info and role
4. Token is returned to the client
5. Client stores token and includes it in subsequent requests

### 2. Authorization Flow

1. Client sends request with `Authorization: Bearer <token>` header
2. `authMiddleware` verifies the JWT token
3. If valid, decoded user info (including role) is attached to `req.user`
4. `roleMiddleware` checks if user's role matches required roles
5. If authorized, request proceeds to route handler
6. If not authorized, 403 Forbidden is returned

### 3. Middleware Chain

```javascript
router.get('/admin/dashboard', 
  authMiddleware,              // Verify JWT token
  roleMiddleware('admin'),     // Check if user has admin role
  (req, res) => {              // Route handler
    // Only admins reach here
  }
);
```

## Key Concepts Demonstrated

1. **JWT Authentication** - Stateless token-based auth
2. **Role-Based Access Control** - Different permissions per role
3. **Middleware Pattern** - Reusable authentication & authorization
4. **Error Handling** - Proper HTTP status codes
5. **Environment Variables** - Secure configuration
6. **Express Routing** - Modular route organization
7. **REST API Design** - Standard HTTP methods and responses

## Security Considerations

⚠️ **Important Notes:**

1. **Hardcoded Users:** For demonstration only. Use a database in production.
2. **JWT Secret:** Change `JWT_SECRET` in production to a strong, random value.
3. **HTTPS:** Always use HTTPS in production to protect tokens in transit.
4. **Token Expiry:** Tokens expire in 24 hours. Implement refresh tokens for production.
5. **Password Hashing:** Use bcrypt or similar to hash passwords in production.
6. **Environment File:** Never commit `.env` file to version control.

## License

MIT License

## Author

Ranjeet-Sahu07

## Contributing

Feel free to open issues or submit pull requests!

---

**Happy Coding! 🚀**
