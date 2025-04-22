const express = require('express');
const app = express();

const cors = require('cors');
const db = require('./models');
const userRoutes = require('./routes/userRouter');
const accountRoutes = require('./routes/accountRouter');
const transactionRoutes = require('./routes/transactionRouter');
const categoryRoutes = require('./routes/categoryRouter');
const budgetRoutes = require('./routes/budgetRouter');

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/budgets', budgetRoutes);


// Health-check
app.get('/', (req, res) => {
  res.send('Server is running health-check');
});

// cek
app.get('/api', (req, res) => {
  res.json({
    message: "Welcome to Personal Finance Tracker API",
    endpoints: {
      users: "/api/users",
      accounts: "/api/accounts",
      transactions: "/api/transactions",
      categories: "/api/categories",
      budgets: "/api/budgets"
    }
  });
});
// Sync database
db.sequelize.sync({ force: false }).then(() => {
  console.log('Database synchronized');
  
  // Start server
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});