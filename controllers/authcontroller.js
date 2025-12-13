const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs'); // to write logs in the auth logs file 
const { db } = require('../db');

const signToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};
const authLog = (event, email, req) => {  //defines a func that takes 3 inputs login sign up... email and requestfor ip
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress; // tries to get availabe ip 
  const line = `${new Date().toISOString()} | ${event} | ${email} | IP: ${ip}\n`; //Creates a log entry event, ip email, date
  
  fs.appendFile('./logs/auth.log', line, (err) => { // stores the entry event in logs 
    if (err) console.error('Logging error:', err.message);
  });
};
const signUp = (req, res) => {
  const { email, password } = req.body;
  const role = 'user'; 

  if (!email || !password) { 
    return res.status(400).json({ error: 'Please provide email and password.' }); 
  }
  bcrypt.hash(password, 10, (err, hashedPassword) => { //hashes pass salt rounds 10 
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error hashing password.' });
    }
    const sql = `INSERT INTO USER (EMAIL, PASSWORD, ROLE) VALUES (?, ?, ?)`; //insert new user to sql 
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

      res.cookie('token', token, { //Sends JWT to browser as a cookie
        httpOnly: true, //Cookie cannot be accessed by JavaScript
        sameSite: 'Strict', 
        secure: false, //not https       
        maxAge: 3600000 //erpires in 1 hour 
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

  const sql = `SELECT * FROM USER WHERE EMAIL = ?`; //SQL query to find user

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

      const token = signToken(row.ID, row.ROLE); //creates jwt after successful login 
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
  authLog('LOGOUT', email, req); //req used to extract ip

  res.clearCookie('token'); //deletes cookie 
  return res.status(200).json({ message: 'Logged out successfully' });
};

const refresh = (req, res) => {
  const token = req.cookies.token; //Reads the cookie named token from the browser This cookie was created earlier by login or signup If the user is logged in → this exists
  
  if (!token) { //  token does not exists 
    return res.status(401).json({ error: 'No token provided.' }); //gets logged out 
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => { // decoded el howa content of token id and role 
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    } 

    const newToken = signToken(decoded.id, decoded.role); //Creates fresh token

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