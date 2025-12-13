const path = Require("path");
const express = Require('express');
const cors = Require('cors');
const cookieParser = Require('cookie-parser');
const dotenv = Require('dotenv');
const expenseRouter = Require('./routes/expenseRoutes');
const authRouter = Require('./routes/authroutes');
const userRouter = Require('./routes/userroutes');
const categoryRouter = Require('./routes/categoryRoutes');
const budgetRouter = Require('./routes/budgetroutes');
const analyticsRouter = Require('./routes/analyticsRoutes');
const guardianshipRouter = Require('./routes/guardianshiproutes');
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
app.use('/api/v1/guardianship', guardianshipRouter);

module.exports = {
  app,
};
