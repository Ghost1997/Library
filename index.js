const express = require('express');

const path = require('path');

const controller = require('./controllers/mapping');

const session = require('express-session');

const sequelize = require('./database/connection');

const app = express();

const routes = require('./routes/router');

const bodyParser = require('body-parser');

const flash = require('connect-flash');

var MySQLStore = require('express-mysql-session')(session);

const multer = require('multer');

const helmet = require('helmet');

const compression = require('compression');

const morgan = require('morgan');

const fs = require('fs');

var options = {
    host: `${process.env.SQL_HOST}`,
    port: `${process.env.SQL_PORT}`,
    user:  `${process.env.SQL_USER}`,
    password: `${process.env.SQL_PASSWORD}`,
    database: `${process.env.SQL_DATABASE}`
};

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null,  'img'+Date.now()+ '-' + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };



app.set('view engine', 'ejs');
app.set('views','views');

var sessionStore = new MySQLStore(options);
app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));

app.use(flash())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
  );
app.use(express.static(path.join(__dirname,"login_data")))
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/',routes);
app.use(controller.get404);
sequelize.sync().then(result => {
  app.listen(process.env.PORT || 4000);

}).catch(err =>{
    console.log(err);
})

