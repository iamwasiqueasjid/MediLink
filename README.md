# MediLink - Smart Healthcare Appointment System

A full-stack healthcare appointment system built with **microservices architecture** and **event-driven design** for a university final lab project.

## 🏗️ Architecture Overview

### Frontend
- **Framework**: Next.js 16 with App Router
- **Authentication**: HttpOnly cookies (secure)
- **Protected Routes**: Middleware-based route protection
- **Dashboards**: Separate interfaces for Patients and Doctors

### Backend Microservices

#### 1. Auth/User Service (Port 3001)
- User registration and login
- JWT token generation
- HttpOnly cookie management
- Role-based authentication (Patient/Doctor)

#### 2. Appointment Service (Port 3002)
- Create appointments (Patients)
- View appointments (role-based)
- Approve/Reject appointments (Doctors)
- Cancel appointments (Patients)
- **Emits events** for all appointment actions

#### 3. Notification Service (Port 3003)
- **Event-driven**: Listens to appointment events
- Creates notifications automatically
- Stores notifications in database
- Provides notification API

### Event-Driven Architecture
- Centralized Event Bus using EventEmitter
- Events: `appointment:created`, `appointment:approved`, `appointment:rejected`, `appointment:cancelled`
- Notification Service responds to all appointment events in real-time

### Database
- **MongoDB** (NoSQL)
- Collections: `users`, `appointments`, `notifications`

### Security Features
- ✅ HttpOnly cookies (no token exposure to client)
- ✅ Protected routes with middleware
- ✅ Password hashing with bcrypt
- ✅ JWT tokens with expiration
- ✅ CORS configuration
- ✅ Role-based access control

## 📁 Project Structure

```
medilink/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login page
│   │   └── register/page.tsx       # Registration page
│   ├── (protected)/
│   │   ├── patient/page.tsx        # Patient dashboard
│   │   └── doctor/page.tsx         # Doctor dashboard
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Landing page
│   └── globals.css                 # Global styles
├── backend/
│   ├── services/
│   │   ├── auth/index.ts           # Auth microservice
│   │   ├── appointment/index.ts    # Appointment microservice
│   │   └── notification/index.ts   # Notification microservice
│   └── shared/
│       ├── database.ts             # MongoDB connection
│       └── eventBus.ts             # Event emitter
├── components/
│   └── DashboardLayout.tsx         # Shared dashboard layout
├── lib/
│   └── api.ts                      # API utility functions
├── middleware.ts                   # Route protection
└── package.json
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)

### Step 1: Install Dependencies
```powershell
npm install
```

### Step 2: Start MongoDB
Make sure MongoDB is running on `mongodb://localhost:27017`

Or update the connection string in `backend/shared/database.ts`

### Step 3: Run the Application
```powershell
npm run dev
```

This command starts:
- Frontend: http://localhost:3000
- Auth Service: http://localhost:3001
- Appointment Service: http://localhost:3002
- Notification Service: http://localhost:3003

### Step 4: Access the Application
Open browser and go to: http://localhost:3000

## 👥 User Roles

### Patient
- Register and login
- Book appointments with doctors
- View appointment status
- Cancel pending appointments
- Receive notifications

### Doctor
- Register with specialization
- View appointment requests
- Approve or reject appointments
- View upcoming appointments
- Receive notifications

## 🧪 Testing the System

### 1. Register Users
```
Register a Doctor:
- Name: Dr. John Smith
- Email: doctor@test.com
- Password: password123
- Role: Doctor
- Specialization: Cardiology

Register a Patient:
- Name: Jane Doe
- Email: patient@test.com
- Password: password123
- Role: Patient
```

### 2. Test Workflow
1. Login as Patient
2. Book an appointment with the doctor
3. Observe event emission in Notification Service console
4. Check notifications in Patient dashboard
5. Logout and login as Doctor
6. See pending appointment request
7. Approve the appointment
8. Observe event emission
9. Login as Patient again
10. See approval notification

## 📊 Demonstrating Event-Driven Architecture

Watch the terminal logs:
- When patient books → `🔔 Event received: Appointment Created`
- When doctor approves → `🔔 Event received: Appointment Approved`
- Notifications automatically created → `📬 Notification created: ...`

## 🔒 Security Highlights for Viva

1. **HttpOnly Cookies**: Token stored in cookie, not accessible by JavaScript
2. **Middleware Protection**: Routes automatically protected before component loads
3. **No secrets in frontend**: All tokens and secrets stay on server
4. **Password Hashing**: bcrypt with salt rounds
5. **JWT Expiration**: 24-hour token validity
6. **CORS Configuration**: Only localhost:3000 allowed

## 🎯 Key Features for Exam

✅ **Microservices**: 3 independent services (Auth, Appointment, Notification)
✅ **Event-Driven**: Event bus with automatic notification triggers
✅ **Security**: HttpOnly cookies, protected routes, JWT
✅ **Frontend**: Next.js with role-based dashboards
✅ **Database**: MongoDB with proper collections
✅ **Professional UI**: Clean navy blue and white theme

## 📝 Explaining in Viva

### Microservices
"We have 3 microservices running on different ports. Each service has its own responsibility and can be scaled independently."

### Event-Driven
"When an appointment is created or updated, the Appointment Service emits an event. The Notification Service listens to these events and automatically creates notifications without direct coupling."

### Security
"We use HttpOnly cookies which browsers automatically send with requests. The token is never accessible by client-side JavaScript, preventing XSS attacks. Middleware checks authentication before allowing access to protected routes."

## 🛠️ Technologies Used

- **Frontend**: Next.js 16, React 19, TailwindCSS 4, TypeScript
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **Authentication**: JWT, bcryptjs
- **Event System**: EventEmitter3
- **Dev Tools**: tsx (TypeScript execution), concurrently

## 📞 Support

For any issues during setup or viva preparation, check:
1. MongoDB is running
2. All ports (3000-3003) are available
3. Dependencies are installed
4. Node.js version is compatible

---

**Built for Advanced Web Development Final Lab**
*Demonstrates microservices, event-driven architecture, and modern web security practices*
