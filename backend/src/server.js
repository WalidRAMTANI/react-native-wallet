import expess from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import transactionRoute from './routes/transactions.route.js';
import ratelimit from './middleware/rateLimiter.js'; // Import the rate limiting middleware
import { connectToDatabase } from './config/db.js';
import job from './config/cron.js';
dotenv.config();

const app = expess();

if(process.env.NODE_ENV === "production") job.start(); // Start the cron job to send GET requests every 14 minutes
const PORT = process.env.PORT || 5001;
app.use(cors());
app.use(expess.json());
app.use(ratelimit); // Apply rate limiting middleware
app.get('/api/health', (req, res) => {
  res.send('Welcome to the Transactions API');
});
app.use('/api/transactions', transactionRoute);

// API endpoints
// Create a new transaction


connectToDatabase().then(() => {
  app.listen(PORT, () => {  console.log(`Server is running on http://localhost:${PORT}`);})
  });