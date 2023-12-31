const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,   
    port: process.env.DATABASE_PORT,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
});


exports.register = (req, res) => {
    console.log(req.body);

    //variables
    /* const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm; */

    //variables (same as above, applicable if variable names are same)
    const { name, username, password, passwordConfirm} = req.body;

    // Check for Empty Fields
    if (!name || !username || !password || !passwordConfirm) {
      return res.render('register', {
          message: 'Please fill in all fields.'
      });
    }

    db.query('SELECT username FROM user WHERE username = ?', [username], async (error, results) => {
        if(error){
            console.log(error);
        }

        if (results.length > 0){
            return res.render('register', {
                message: 'The username is already taken!'
            });
        }   else if ( password !== passwordConfirm ){
            return res.render('register', {
                message: 'Passwords does not match!'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        
        db.query('INSERT INTO user SET ?', {name: name, username: username, password: hashedPassword}, (error, results) => {
            if(error){
                console.log(error);
            } else {
                console.log(results);
                return res.render('register', {
                    message: 'User Registered!'
                });
            }
        });

    });
}

exports.login = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      if( !username || !password ) {
        return res.status(400).render('login', {
          message: 'Please provide a username and password'
        })
      }
  
      db.query('SELECT * FROM user WHERE username = ?', [username], async (error, results) => {
        console.log(results);
        if( !results || !(await bcrypt.compare(password, results[0].password)) ) {
          res.status(401).render('login', {
            message: 'Username or Password is incorrect'
          })
        } else {
          const user_id = results[0].user_id;
  
          const token = jwt.sign({ user_id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
          });
  
          console.log("The token is: " + token);
  
          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
          }
  
          res.cookie('jwt', token, cookieOptions );
          res.status(200).redirect("/");
        }
  
      })
  
    } catch (error) {
      console.log(error);
    }
}

exports.isLoggedIn = async (req, res, next) => {
  console.log("is logged in");  
  console.log(req.cookies);
    if( req.cookies.jwt) {
      try {
        //1) verify the token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt,
        process.env.JWT_SECRET
        );
          
        console.log("decoded");
        console.log(decoded);
  
        //2) Check if the user still exists
        db.query('SELECT * FROM user WHERE user_id = ?', [decoded.user_id], (error, result) => {
          console.log("user exist:");
          console.log(result);
  
          if(!result) {
            return next();
          }
  
          req.user = result[0];
          console.log("user is")
          console.log(req.user);
          return next();
  
        });
      } catch (error) {
        console.log(error);
        return next();
      }
    } else {
      next();
    }
}
  
  

exports.logout = async (req, res) => {
    res.cookie('jwt', 'logout', {
      expires: new Date(Date.now() + 2*1000),
      httpOnly: true
    });
  
    res.status(200).redirect('/');
}