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
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const line = `${new Date().toISOString()} | ${event} | ${email} | IP: ${ip}\n`;
  
  fs.appendFile('./logs/auth.log', line, (err) => {
    if (err) console.error('Logging error:', err.message);
  });
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
    const sql = `INSERT INTO USER (EMAIL, PASSWORD, ROLE) VALUES (?, ?, ?)`;
    db.run(sql, [email, hashedPassword, role], function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
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
        maxAge: 3600000
      });

      return res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        userId: this.lastID
      });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password.' });
  }

  const sql = `SELECT * FROM USER WHERE EMAIL = ?`;

  db.get(sql, [email], (err, row) => {
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
      authLog('LOGIN SUCCESS', email, req);

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'Strict',
        secure: false,        
        maxAge: 3600000
      });

      return res.status(200).json({
        status: 'success',
        message: 'Login successful',
        user: {
          id: row.ID,
          email: row.EMAIL,
          role: row.ROLE
        }
      });
    });
  });
};

const logout = (req, res) => {
  const email = req.user ? req.user.id : 'unknown';
  authLog('LOGOUT', email, req);

  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out successfully' });
};

const refresh = (req, res) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }

    const newToken = signToken(decoded.id, decoded.role);

    res.cookie('token', newToken, {
      httpOnly: true,
      sameSite: 'Strict',
      secure: false,
      maxAge: 3600000
    });

    return res.status(200).json({ message: 'Token refreshed' });
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

module.exports = {
  signUp,
  login,
  logout,
  refresh,
  verifyToken,
  verifyAdmin
};