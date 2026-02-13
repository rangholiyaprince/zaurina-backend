# Zaurina Backend - Production-Ready Folder Structure

## 📁 Project Structure

```
zaurina-backend/
├── .env                          # Environment variables (DO NOT COMMIT)
├── .env.sample                   # Sample environment variables template
├── .gitignore                    # Git ignore rules
├── .prettierrc                   # Code formatting rules
├── .prettierignore               # Prettier ignore rules
├── package.json                  # Project dependencies and scripts
├── package-lock.json             # Locked dependency versions
├── README.md                     # Project documentation
├── CLOUDINARY_UPLOAD_GUIDE.md    # Cloudinary upload documentation
│
├── public/                       # Static files served by Express
│   └── (empty - ready for static assets)
│
└── src/                          # Source code
    ├── server.js                 # Entry point - starts the server
    ├── app.js                    # Express app configuration
    ├── constants.js              # Application constants
    │
    ├── config/                   # Configuration files
    │   ├── cloudinary.js         # Cloudinary setup and validation
    │   ├── db.js                 # Database configuration
    │   └── passport.js           # Passport authentication config
    │
    ├── db/                       # Database connection
    │   └── index.js              # MongoDB connection logic
    │
    ├── models/                   # Mongoose models (Database schemas)
    │   ├── User.model.js         # User schema
    │   └── Address.model.js      # Address schema
    │
    ├── controllers/              # Request handlers (Business logic)
    │   ├── auth.controller.js    # Authentication endpoints
    │   ├── address.controller.js # Address management endpoints
    │   ├── profile.controller.js # Profile image upload endpoints
    │   └── health.controller.js  # Health check endpoint
    │
    ├── services/                 # Business logic layer
    │   ├── auth.service.js       # Authentication services
    │   ├── address.service.js    # Address services
    │   └── upload.service.js     # Cloudinary upload services
    │
    ├── middlewares/              # Express middlewares
    │   ├── auth.middleware.js    # Authentication middleware
    │   ├── upload.middleware.js  # File upload middleware (Multer + Cloudinary)
    │   ├── error.middleware.js   # Global error handler
    │   └── logger.middleware.js  # Request logging middleware
    │
    ├── routes/                   # API route definitions
    │   ├── index.js              # ✅ Central route registry
    │   ├── auth.routes.js        # Authentication routes
    │   ├── user.routes.js        # User management routes
    │   ├── address.routes.js     # Address routes
    │   └── profile.routes.js     # Profile image routes
    │
    ├── utils/                    # Utility functions and helpers
    │   ├── ApiError.util.js      # Custom error class
    │   ├── fileValidation.util.js # File validation helpers
    │   ├── sendEmail.js          # Email sending utility
    │   └── token.js              # JWT token utilities
    │
    └── seeders/                  # Database seeders
        ├── user.seeder.js        # User data seeder
        └── drop-index.js         # Index management
```

---

## 🏗️ Architecture Layers

### 1. **Entry Point Layer**
- `server.js` - Starts the HTTP server
- `app.js` - Configures Express middleware and routes

### 2. **Configuration Layer** (`config/`)
- Environment-based configuration
- Third-party service setup (Cloudinary, Passport, Database)

### 3. **Database Layer** (`db/` + `models/`)
- Database connection management
- Mongoose schemas and models

### 4. **Route Layer** (`routes/`)
- **`index.js`** - Central route registry (all routes imported here)
- Individual route files for each feature
- Route-level middleware application

### 5. **Middleware Layer** (`middlewares/`)
- Request preprocessing
- Authentication/Authorization
- File upload handling
- Error handling

### 6. **Controller Layer** (`controllers/`)
- Request/Response handling
- Input validation
- Calls service layer for business logic

### 7. **Service Layer** (`services/`)
- Business logic implementation
- Database operations
- Third-party API calls (Cloudinary, etc.)

### 8. **Utility Layer** (`utils/`)
- Reusable helper functions
- Custom error classes
- Common utilities

---

## 🔄 Centralized Route Structure

### routes/index.js (Central Registry)

```javascript
const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const addressRoutes = require('./address.routes');
const profileRoutes = require('./profile.routes');

// Register routes
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/addresses', addressRoutes);
router.use('/profile', profileRoutes);

module.exports = router;
```

### app.js (Simplified)

```javascript
const apiRoutes = require('./routes');

// Single line to register all API routes
app.use('/api', apiRoutes);
```

**Benefits:**
- ✅ Single source of truth for all routes
- ✅ Easy to add new routes
- ✅ Clean and maintainable
- ✅ Scalable for large applications

---

## 📊 Request Flow

```
Client Request
    ↓
app.js → /api
    ↓
routes/index.js → Route matching
    ↓
Specific route file (auth.routes.js, etc.)
    ↓
Middleware (middlewares/) - Auth, Validation, Upload
    ↓
Controller (controllers/) - Request handling
    ↓
Service (services/) - Business logic
    ↓
Model (models/) - Database operations
    ↓
Response to Client
```

---

## 🎯 API Endpoints

### Base URL: `http://localhost:8000/api`

### Authentication (`/api/auth`)
- POST `/register` - User registration
- POST `/login` - User login
- POST `/forgot-password` - Request password reset
- POST `/reset-password` - Reset password
- POST `/logout` - User logout
- GET `/me` - Get current user profile
- POST `/update-profile` - Update user profile
- GET `/google` - Google OAuth login
- GET `/google/callback` - Google OAuth callback

### User Management (`/api/user`)
- GET `/profile` - Get user profile
- PUT `/profile` - Update user profile

### Address Management (`/api/addresses`)
- GET `/` - Get all addresses
- POST `/` - Create address
- PUT `/:id` - Update address
- DELETE `/:id` - Delete address

### Profile Image (`/api/profile`)
- POST `/upload-image` - Upload profile image
- PUT `/update-image` - Update profile image
- DELETE `/delete-image` - Delete profile image
- GET `/image-details/:publicId` - Get image details

### Health Check (`/api/health`)
- GET `/` - Server health status

---

## 🔒 Production Best Practices Implemented

### ✅ Centralized Route Management
- All routes registered in `routes/index.js`
- Easy to see all available endpoints
- Scalable for large applications

### ✅ Separation of Concerns
- Each layer has a single responsibility
- Easy to test and maintain
- Clear dependencies

### ✅ Security
- Environment variables for sensitive data
- Authentication middleware
- File validation
- Error handling without exposing internals

### ✅ Code Organization
- Logical folder structure
- Consistent naming conventions
- Modular and reusable code

### ✅ Error Handling
- Custom error classes
- Global error middleware
- Proper HTTP status codes

### ✅ Scalability
- Service layer for business logic
- Easy to add new features
- Clear separation between layers

---

## 📝 File Naming Conventions

- **Models**: `PascalCase.model.js` (e.g., `User.model.js`)
- **Controllers**: `camelCase.controller.js` (e.g., `auth.controller.js`)
- **Services**: `camelCase.service.js` (e.g., `upload.service.js`)
- **Routes**: `camelCase.routes.js` (e.g., `profile.routes.js`)
- **Middlewares**: `camelCase.middleware.js` (e.g., `auth.middleware.js`)
- **Utils**: `camelCase.util.js` (e.g., `ApiError.util.js`)
- **Config**: `camelCase.js` (e.g., `cloudinary.js`)

---

## 🚀 Adding New Routes

### Step 1: Create Route File
```javascript
// src/routes/product.routes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);

module.exports = router;
```

### Step 2: Register in Central Index
```javascript
// src/routes/index.js
const productRoutes = require('./product.routes');

router.use('/products', productRoutes);
```

That's it! Your new routes are now available at `/api/products`

---

## 🔧 Environment Variables

Required variables in `.env`:

```env
# Server
PORT=8000

# Database
MONDODB_URL=mongodb+srv://...

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Upload Configuration
MAX_FILE_SIZE=2097152
ALLOWED_IMAGE_FORMATS=jpg,jpeg,png,webp

# CORS
CORS_ORIGIN=*
```

---

## 📦 Dependencies

### Production Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cloudinary` - Image hosting service
- `multer` - File upload handling
- `multer-storage-cloudinary` - Cloudinary storage for Multer
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- `passport` - Authentication middleware
- `passport-google-oauth20` - Google OAuth
- `nodemailer` - Email sending
- `cors` - CORS middleware

### Development Dependencies
- `dotenv` - Environment variables
- `nodemon` - Auto-restart server
- `prettier` - Code formatting

---

## 🚀 NPM Scripts

```json
{
  "dev": "nodemon -r dotenv/config src/server.js",
  "seed:users": "node src/seeders/user.seeder.js",
  "db:fix-index": "node src/seeders/drop-index.js"
}
```

---

## 🎓 Why This Structure?

### Scalability
- Easy to add new features without affecting existing code
- Centralized route management
- Clear separation makes it easy for teams to work in parallel

### Maintainability
- Each file has a single responsibility
- Easy to locate and fix bugs
- Consistent patterns throughout
- Single source of truth for routes

### Testability
- Service layer can be tested independently
- Controllers can be tested with mocked services
- Clear dependencies make mocking easier

### Professional Standards
- Follows industry best practices
- Similar to structures used by companies like Airbnb, Uber, etc.
- Easy for new developers to understand
- Centralized route registry pattern

---

## 📚 Additional Documentation

- [CLOUDINARY_UPLOAD_GUIDE.md](file:///c:/xampp/htdocs/zaurina-backend/CLOUDINARY_UPLOAD_GUIDE.md) - Complete Cloudinary setup and usage guide

---

**This structure is production-ready and follows enterprise-level best practices!** 🚀

The centralized route structure makes it easy to:
- See all available endpoints at a glance
- Add new routes quickly
- Maintain consistency across the application
- Scale to hundreds of endpoints
