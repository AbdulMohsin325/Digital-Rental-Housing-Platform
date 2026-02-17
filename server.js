import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

import adminRoutes from "./routes/adminRoutes.js";



// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use("/api/admin", adminRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to User CRUD API with Authentication',
        version: '2.0.0',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                getMe: 'GET /api/auth/me (Protected)'
            },
            users: {
                getAll: 'GET /api/users (Protected)',
                getById: 'GET /api/users/:id (Protected)',
                create: 'POST /api/users (Protected)',
                update: 'PUT /api/users/:id (Protected)',
                delete: 'DELETE /api/users/:id (Protected)'
            }
        }
    });
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});
