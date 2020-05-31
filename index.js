const express = require('express');

const path = require('path');

const controller = require('./controllers/mapping');

const session = require('express-session');

const mongoose = require('mongoose');

const app = express();

const routes = require('./routes/router');

const bodyParser = require('body-parser');

const flash = require('connect-flash');


const MongoDBStore = require('connect-mongodb-session')(session);

var MySQLStore = require('express-mysql-session')(session);

const multer = require('multer');

const helmet = require('helmet');

const compression = require('compression');

const morgan = require('morgan');

const fs = require('fs');

const MONGODB_URI =`mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@cluster0-jne8p.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;

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

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: store,
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

mongoose
  .connect(
    MONGODB_URI
  )
  .then(result => {
    app.listen(4000);
  })
  .catch(err => {
    console.log(err);
  });



