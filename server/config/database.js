const mongoose = require('mongoose');
const colors = require('colors'); // For console colors (optional)

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'asatu', // Your database name
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      socketTimeoutMS: 45000 // Close sockets after 45s inactivity
    });

    console.log(colors.green(`[MongoDB] Connected: ${conn.connection.host}`));
    console.log(colors.blue(`[Database] Using: ${conn.connection.name}`));
    
  } catch (err) {
    console.error(colors.red(`[MongoDB] Error: ${err.message}`));
    
    // Detailed error diagnostics
    if (err.name === 'MongooseServerSelectionError') {
      console.log(colors.yellow('Tip: Check your:'));
      console.log('1. Internet connection');
      console.log('2. MongoDB Atlas IP whitelist');
      console.log('3. Database user permissions');
    }
    
    process.exit(1); // Exit with failure
  }
};

// MongoDB event listeners
mongoose.connection.on('connected', () => {
  console.log(colors.green('[MongoDB] Connection active'));
});

mongoose.connection.on('error', (err) => {
  console.error(colors.red(`[MongoDB] Lost connection: ${err}`));
});

mongoose.connection.on('disconnected', () => {
  console.log(colors.yellow('[MongoDB] Disconnected'));
});

// Close connection on process termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log(colors.red('[MongoDB] Connection closed due to app termination'));
  process.exit(0);
});

module.exports = connectDB;
