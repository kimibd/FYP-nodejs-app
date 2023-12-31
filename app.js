const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');

const exphbs = require('express-handlebars').create({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        eq: function (a, b) {
            return a === b;
        }
    }
});

dotenv.config({ path: './.env'});

const app = express();

//Database Connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,   
    port: process.env.DATABASE_PORT,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
});

//Check Database Connection
db.connect( (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MySQL Connected...")
    }
});


// const createUnixSocketPool = async config => {
//     const pool = mysql.createPool({
//       user: process.env.DATABASE_USER,
//       password: process.env.DATABASE_PASSWORD,
//       database: process.env.DATABASE_NAME,
//       socketPath: process.env.INSTANCE_UNIX_SOCKET,
//       ...config,
//     });
  
//     // Test the connection pool asynchronously
//     await new Promise((resolve, reject) => {
//       pool.getConnection((err, connection) => {
//         if (err) {
//           console.error('Error connecting to the database pool', err);
//           reject(err);
//         } else {
//           connection.release();
//           console.log('Connected to the database pool');
//           resolve();
//         }
//       });
//     });
  
//     return pool;
// };
  
// // Initialize the pool at the beginning
// async function initialize() {
//     global.dbPool = await createUnixSocketPool();
// }
  
// initialize().then(() => {
//     // Start server or perform other setup tasks
//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
// });
  

const publicDirectory = path.join(__dirname, './public')
console.log(__dirname, '= dirname');
app.use(express.static(publicDirectory));

//Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false}));
//Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'hbs')
app.engine('hbs', exphbs.engine);

//Use routes instead
/* app.get("/", (req, res) => {
    //res.send("<h1> Home Page </h1>")
    //render index.hbs
    res.render("index")
}); */

//Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.use('/execute', require('./execute/executeCommand'));
app.use('/execute', require('./execute/gobuster'));
app.use('/execute', require('./execute/nmap'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});