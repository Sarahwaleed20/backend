const express = Require('express'); // all routes rquire this import da node js framework that builds backend servers 
const router = express.Router(); //creates a container where related routes are grouped together
const { signUp, login, logout, refresh, verifyToken } = Require('../controllers/authcontroller'); //imports auth logic from auth controller 

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', verifyToken, logout);
router.post('/refresh', refresh);

module.exports = router;
