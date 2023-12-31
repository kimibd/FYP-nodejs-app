const express = require("express");
const authController = require('../controllers/auth');

const router = express.Router();

/* router.get('/', (req, res) => {
    res.render('index');
});*/

// router.get('/gobuster', (req, res) => {
//     res.render('gobuster')
// });

// router.get('/nmap', (req, res) => {
//     res.render('nmap')
// });

router.get('/', authController.isLoggedIn, (req, res) => {
    res.render('index', {
      user: req.user
    });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/gobuster', authController.isLoggedIn, (req, res) => {
    console.log(req.user); // Logging user information for debugging
    if (req.user) {
      res.render('gobuster', { user: req.user});
    } else {
      res.redirect('/login');
    }
});

router.get('/nmap', authController.isLoggedIn, (req, res) => {
    console.log(req.user); // Logging user information for debugging
    if (req.user) {
      res.render('nmap', { user: req.user});
    } else {
      res.redirect('/login');
    }
});

router.get('/executeCommand', authController.isLoggedIn, (req, res) => {
  console.log(req.user); // Logging user information for debugging
  if (req.user) {
    res.render('executeCommand', { user: req.user});
  } else {
    res.redirect('/login');
  }
});
  

module.exports = router;