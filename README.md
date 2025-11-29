# Doctor Appointment System 🏥

A full-stack Node.js backend application for managing doctor appointments, departments, and user authentication with advanced security features including data encryption and password hashing.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Security Features](#security-features)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [Data Encryption](#data-encryption)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### User Management
- User registration with email verification
- User login with email or phone
- User profile management
- Account activation via email confirmation
- JWT-based authentication
- Role-based access control

### Doctor Management
- Doctor registration and activation
- Doctor profile management with specialties
- Doctor experience and description
- Profile picture upload support
- Doctor availability and scheduling

### Appointments System
- Book appointments with doctors
- View appointment history
- Cancel appointments
- Appointment status tracking (scheduled, completed, cancelled)
- Reason for visit (encrypted for privacy)
- Date and time management

### Department Management
- Create and manage medical departments
- Assign doctors to departments
- Department descriptions

### Security Features
- **Password Hashing**: bcryptjs with salt for secure password storage
- **Data Encryption**: AES encryption for phone numbers and appointment reasons
- **JWT Authentication**: Secure token-based authentication
- **Email Verification**: Two-step email confirmation for account activation
- **Input Validation**: Comprehensive Joi validation for all inputs
- **Global Error Handler**: Centralized error handling with meaningful messages
- **CORS Ready**: Configured for cross-origin requests

### Additional Features
- **Email Notifications**: Automated emails for registration, activation, and appointments
- **File Upload**: Support for profile pictures using Multer
- **Database Connection**: MySQL2 with promise-based queries
- **ORM Support**: Sequelize integration for advanced queries
- **Development Tools**: Nodemon for auto-restart during development

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Runtime** | Node.js |
| **Framework** | Express.js v5 |
| **Database** | MySQL 2 |
| **ORM** | Sequelize |
| **Authentication** | JWT (jsonwebtoken) |
| **Password Security** | bcryptjs |
| **Data Encryption** | Crypto-JS (AES) |
| **File Upload** | Multer |
| **Email Service** | Nodemailer |
| **Input Validation** | Joi |
| **Development** | Nodemon |

## 🔐 Security Features

### 1. Password Protection
- Passwords are hashed using **bcryptjs** with configurable salt rounds
- One-way hashing ensures passwords cannot be reversed
- Each password gets a unique salt
- Comparisons done securely without exposing hashes

### 2. Data Encryption
- **Phone Numbers**: Encrypted using AES (Advanced Encryption Standard)
- **Appointment Reasons**: Encrypted for privacy (medical information)
- **ENCRYPTION_KEY**: 32+ character key from environment variables
- Decryption happens only when data is retrieved and sent to client

### 3. JWT Authentication
- Secure token generation with secret key
- Token expiration: 1 hour per session
- Payload includes: user ID, email, phone, and role
- Verified on every protected route

### 4. Email Verification
- Two-step verification process
- Activation token sent via email
- Account locked until email confirmed
- Token expiration for security

### 5. Input Validation
- All inputs validated with Joi schemas
- Prevents SQL injection and malicious data
- Type checking and format validation
- Custom error messages

## 📦 Installation

### Prerequisites

- **Node.js**: v14 or higher
- **MySQL Server**: v5.7 or higher
- **npm** or **yarn**: Package manager
- **Git**: For version control

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/doctor-appointment.git
   cd doctor-appointment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your credentials**
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=Doctor_Appointment
   ENCRYPTION_KEY=your_32+_character_key
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

5. **Create database**
   ```bash
   mysql -u root -p
   CREATE DATABASE Doctor_Appointment;
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

Server starts on `http://localhost:3000`

## 🔧 Environment Configuration

Create a `.env` file with these variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_PORT=3306
DB_NAME=Doctor_Appointment

# JWT Configuration
JWT_SECRET_KEY=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE_TIME=7d

# Encryption Configuration (AES)
ENCRYPTION_KEY=your_encryption_key_here_min_32_characters

# Email Configuration (Nodemailer - Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=noreply@doctorappointment.com

# Password Hashing
ROUND=10
```

### Important Notes:
- ⚠️ **Never commit `.env` file** - It's in `.gitignore`
- Use `.env.example` as template
- Keep ENCRYPTION_KEY and JWT_SECRET_KEY secure
- For Gmail: Use App Password, not regular password
- Change all keys in production environment

## 📡 API Endpoints

### User Routes (`/user`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/user/register` | Register new user | ❌ |
| POST | `/user/login` | User login | ❌ |
| GET | `/user/profile` | Get user profile | ✅ |
| PUT | `/user/profile` | Update user profile | ✅ |
| GET | `/user/:id` | Get specific user | ✅ |
| GET | `/user` | Get all users | ✅ |
| DELETE | `/user/:id` | Delete user account | ✅ |
| GET | `/user/activate/:token` | Activate account | ❌ |

### Doctor Routes (`/doctor`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/doctor` | Add new doctor | ✅ |
| GET | `/doctor` | Get all doctors | ❌ |
| GET | `/doctor/:id` | Get specific doctor | ❌ |
| PUT | `/doctor/:id` | Update doctor info | ✅ |
| DELETE | `/doctor/:id` | Delete doctor | ✅ |
| POST | `/doctor/login` | Doctor login | ❌ |
| GET | `/doctor/activate/:token` | Activate doctor account | ❌ |

### Appointments Routes (`/appointments`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/appointments` | Book appointment | ✅ |
| GET | `/appointments` | Get user appointments | ✅ |
| GET | `/appointments/:id` | Get specific appointment | ✅ |
| PUT | `/appointments/:id` | Reschedule appointment | ✅ |
| DELETE | `/appointments/:id` | Cancel appointment | ✅ |

### Department Routes (`/department`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/department` | Get all departments | ❌ |
| GET | `/department/:id` | Get specific department | ❌ |
| POST | `/department` | Add new department | ✅ |
| PUT | `/department/:id` | Update department | ✅ |
| DELETE | `/department/:id` | Delete department | ✅ |

## 📁 Project Structure

```
doctor-appointment/
├── src/
│   ├── app.controller.js                 # Main application bootstrap
│   │
│   ├── config/
│   │   └── database.js                   # MySQL connection configuration
│   │
│   ├── controller/                       # Business logic layer
│   │   ├── appointmentsController.js     # Appointment management
│   │   ├── DepartmentsController.js      # Department management
│   │   ├── DoctorController.js           # Doctor management
│   │   └── userController.js             # User management
│   │
│   ├── modules/
│   │   └── userSchema.js                 # Database schemas
│   │
│   ├── Routs/                            # API routes
│   │   ├── appointmentsRout.js           # Appointment routes
│   │   ├── DepartmentsRout.js            # Department routes
│   │   ├── DoctorRout.js                 # Doctor routes
│   │   └── userRout.js                   # User routes
│   │
│   ├── utils/
│   │   ├── emails/                       # Email utilities
│   │   │   ├── email.event.js            # Email event emitter
│   │   │   ├── generateHTML.js           # HTML email templates
│   │   │   └── sendEmailFiles.js         # Send email service
│   │   │
│   │   ├── encrypt/                      # Data encryption
│   │   │   └── encrypt.js                # AES encrypt/decrypt functions
│   │   │
│   │   ├── errorHandler/                 # Error handling middleware
│   │   │   ├── asyncHandler.js           # Async error wrapper
│   │   │   ├── authMiddleware.js         # JWT verification
│   │   │   └── globalErrorHandler.js     # Global error handler
│   │   │
│   │   ├── Hash/                         # Password hashing
│   │   │   └── hash.js                   # bcryptjs hashing functions
│   │   │
│   │   ├── multer/                       # File upload configuration
│   │   │   └── upload.js                 # Multer setup
│   │   │
│   │   └── token/                        # JWT token utilities
│   │       └── token.js                  # Token generation & verification
│   │
│   └── validation/                       # Input validation schemas
│       ├── appointmentValidation.js      # Appointment validation
│       ├── departmentValidation.js       # Department validation
│       ├── doctorvalidation.js           # Doctor validation
│       ├── fields.js                     # Common validation fields
│       ├── userValidation.js             # User validation
│       └── validation.middleware.js      # Validation middleware
│
├── uploads/                              # Uploaded files directory
│
├── index.js                              # Application entry point
├── package.json                          # Dependencies & scripts
├── .env                                  # Environment variables (not in repo)
├── .env.example                          # Example environment variables
├── .gitignore                            # Git ignore rules
└── README.md                             # This file
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL (hashed),
  phone VARCHAR(255) NOT NULL (encrypted),
  isActive BOOLEAN DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Doctors Table
```sql
CREATE TABLE doctors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(255) NOT NULL (encrypted),
  password VARCHAR(255) NOT NULL (hashed),
  image VARCHAR(255),
  description TEXT,
  experience_years INT,
  isActive BOOLEAN DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Appointments Table
```sql
CREATE TABLE appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  doctor_id INT NOT NULL,
  date DATETIME NOT NULL,
  reason TEXT NOT NULL (encrypted),
  status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);
```

### Departments Table
```sql
CREATE TABLE departments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔐 Authentication & Authorization

### JWT Token Structure
```javascript
payload: {
  id: user_id,
  email: user_email,
  phone: encrypted_phone,
  role: user_role
}
options: {
  expiresIn: '1h'
}
```

### Protected Routes
All routes requiring authentication use `authMiddleware` to verify JWT tokens:
- Token sent in `Authorization: Bearer <token>` header
- Token decoded and user info attached to request
- Request rejected if token invalid or expired

### Activation Flow
1. User registers → Account created with `isActive = 0`
2. Activation email sent with JWT token
3. User clicks activation link
4. Token verified and account activated (`isActive = 1`)
5. User can now login

## 🔐 Data Encryption

### What Gets Encrypted?

| Data | Method | Key Source |
|------|--------|-----------|
| **Passwords** | bcryptjs (hashing) | Auto-salt |
| **Phone Numbers** | AES-256 Encryption | ENCRYPTION_KEY |
| **Appointment Reasons** | AES-256 Encryption | ENCRYPTION_KEY |

### Encryption Flow

**Storing Data:**
```javascript
const encryptedPhone = encrypt({ plaintext: phone });
// Store encryptedPhone in database
```

**Retrieving Data:**
```javascript
const [user] = await db.query('SELECT phone FROM users WHERE id = ?', [id]);
const decryptedPhone = decrypt({ ciphertext: user.phone });
// Return decryptedPhone to client
```

### Encryption Key Security
- Stored in `.env` file (not in repository)
- Minimum 32 characters recommended
- Uses AES algorithm from crypto-js library
- Different from JWT secret for layered security

## 📧 Email Setup

### Email Configuration
- **Provider**: Nodemailer
- **Supported Services**: Gmail, Outlook, custom SMTP
- **Use Cases**:
  - Account registration confirmation
  - Account activation email
  - Appointment notifications
  - Password reset (future feature)

### Gmail Setup
1. Enable 2-factor authentication
2. Generate App Password
3. Use App Password in `EMAIL_PASSWORD` env variable
4. Set `EMAIL_USER` to your Gmail address

### Email Templates
- Activation email with token link
- Welcome email with account details
- Appointment confirmation
- Appointment reminders

## ❌ Error Handling

### Global Error Handler
All errors caught by `globalErrorHandler` middleware:

| Status | Type | Example |
|--------|------|---------|
| 400 | Validation Error | Missing required fields |
| 401 | Authentication Error | Invalid credentials |
| 404 | Not Found | User/Doctor not found |
| 409 | Conflict | Email already exists |
| 500 | Server Error | Database connection failed |

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "status": 400
}
```

### Async Error Wrapper
- `asyncHandler` middleware wraps controller functions
- Catches all promise rejections
- Passes errors to global handler

## 🚀 Getting Started

### Quick Start
```bash
# 1. Clone repository
git clone <repo-url>
cd doctor-appointment

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your config

# 4. Create database
mysql -u root -p < database.sql

# 5. Start server
npm run dev
```

### Testing with Postman
1. Import API endpoints
2. Register user (POST `/user/register`)
3. Activate account (use email link)
4. Login (POST `/user/login`)
5. Copy token from response
6. Add token to Authorization header: `Bearer <token>`
7. Test protected endpoints

## 📝 Code Quality

### Best Practices Implemented
- ✅ Separation of concerns (controllers, routes, utils)
- ✅ Centralized error handling
- ✅ Input validation on all endpoints
- ✅ Secure password hashing
- ✅ Data encryption for sensitive fields
- ✅ JWT-based authentication
- ✅ Environment-based configuration
- ✅ Async/await error handling
- ✅ Meaningful error messages
- ✅ Consistent code structure

## 🐛 Debugging

### Useful npm Scripts
```bash
npm run dev        # Start development server with nodemon
npm start          # Start production server
```

### Common Issues

**Issue**: Database connection failed
- Solution: Check DB credentials in `.env`
- Verify MySQL server is running

**Issue**: Email not sending
- Solution: Check Gmail app password (not regular password)
- Verify email credentials in `.env`

**Issue**: Token invalid/expired
- Solution: Login again to get new token
- Check JWT_SECRET_KEY in `.env`

**Issue**: Encryption key error
- Solution: Ensure ENCRYPTION_KEY is 32+ characters
- Regenerate key if it contains special characters

## 📋 API Usage Examples

### Register User
```bash
POST /user/register
Content-Type: application/json

{
  "name": "Ahmed",
  "email": "ahmed@example.com",
  "password": "secure123",
  "phone": "+201012345678"
}
```

### Login User
```bash
POST /user/login
Content-Type: application/json

{
  "emailOrPhone": "ahmed@example.com",
  "password": "secure123"
}
```

### Book Appointment
```bash
POST /appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "doctor_id": 1,
  "date": "2025-12-15T10:30:00Z",
  "reason": "Routine checkup"
}
```

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add some feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## 📄 License

This project is licensed under the ISC License

## 👨‍💻 Author

Your Name - [GitHub Profile](https://github.com/yourusername)

## 📞 Support

For support, email support@doctorappointment.com or open an issue on GitHub

## 🔒 Security

### Reported Security Issues
Please email security@doctorappointment.com for sensitive security issues

### Security Checklist
- ✅ Passwords hashed with bcryptjs
- ✅ Sensitive data encrypted
- ✅ JWT authentication
- ✅ Email verification required
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ CORS configured
- ✅ Environment variables protected

---

**Last Updated**: November 2025
**Version**: 1.0.0
**Status**: ✅ Production Ready
