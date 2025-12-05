const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const expenseRouter = require('./routes/expenseRoutes');
const authRouter = require('./routes/authRoutes');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
}));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/expenses', expenseRouter);

module.exports = {
  app,
};
