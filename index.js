const path = require("path");
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const expenseRouter = require('./routes/expenseRoutes');
const authRouter = require('./routes/authroutes');
const userRouter = require('./routes/userroutes');
const categoryRouter = require('./routes/categoryRoutes');
const budgetRouter = require('./routes/budgetroutes');
const analyticsRouter = require('./routes/analyticsRoutes');
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
  credentials: true
}));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/expenses', expenseRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/budgets', budgetRouter);
app.use('/api/v1/analytics', analyticsRouter);

module.exports = {
  app,
};
