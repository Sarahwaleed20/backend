const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const { db } = require('../db');

const signToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const authLog = (event, email, req) => {
  const ip = req.ip;
  const line = `${new Date().toISOString()} | ${event} | ${email} | IP: ${ip}\n`;
  fs.appendFile('./logs/auth.log', line, () => {});
};

const signUp = (req, res) => {
  const { email, password } = req.body;
  const role = 'user';

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password.' });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error hashing password.' });
    }

    const query = `INSERT INTO USER (EMAIL, PASSWORD, ROLE) VALUES (?, ?, ?)`;

    db.run(query, [email, hashedPassword, role], function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint')) {
          authLog('SIGNUP FAILED - EMAIL EXISTS', email, req);
          return res.status(400).json({ error: 'Email already exists.' });
        }
        console.error(err);
        return res.status(500).json({ error: 'Database error.' });
      }

      const token = signToken(this.lastID, role);
      authLog('SIGNUP SUCCESS', email, req);

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'Strict',
        secure: false, 
        maxAge: 3600000,
      });

      return res.status(201).json({
        status: 'success',
        message: 'Registration successful',
        userId: this.lastID,
      });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password.' });
  }

  const query = `SELECT * FROM USER WHERE EMAIL = ?`;

  db.get(query, [email], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error.' });
    }

    if (!row) {
      authLog('LOGIN FAILED - USER NOT FOUND', email, req);
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    bcrypt.compare(password, row.PASSWORD, (err, isMatch) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Password verification error.' });
      }

      if (!isMatch) {
        authLog('LOGIN FAILED - WRONG PASSWORD', email, req);
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      const token = signToken(row.ID, row.ROLE);

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'Strict',
        secure: false,
        maxAge: 3600000,
      });

      authLog('LOGIN SUCCESS', email, req);

      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: row.ID,
          email: row.EMAIL,
          role: row.ROLE,
        },
      });
    });
  });
};

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ error: 'Access denied: Token missing.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }

    req.user = { id: decoded.id, role: decoded.role };
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admins only.' });
    }
    next();
  });
};

module.exports = { signUp, login, verifyToken, verifyAdmin };
