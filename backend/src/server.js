require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://amantiwari2357:amantiwari2357@thinkaman.6lgzvfw.mongodb.net/?retryWrites=true&w=majority&appName=thinkaman', {
      // Remove deprecated options - mongoose handles these automatically in newer versions
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

// Start server after DB connection
const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
});
