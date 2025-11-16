const express = require('express');
const { signup, signin, verifyToken } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);

// Protected route example
router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});


router.post("/logout", verifyToken, ); // Protected

module.exports = router;