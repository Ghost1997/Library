const express = require('express');

const controller = require('../controllers/mapping');

const user = require('../model/user_model');
const book = require('../model/book_model');

const { check, body } = require('express-validator/check');

const auth =require('../operations/auth')

const router = express.Router();

router.get('/add-student',auth,controller.getAddStudent);

router.post('/add-student',auth,[body('roll_no').custom((value, { req }) => {
  if (value <0 || value>100) {
    throw new Error('Roll No Should Be In Between [1-100]');
  }
  return true;
}),
check('name').isAlphanumeric.withMessage('Name Can Only Contain Alphabets and Numbers')
], controller.postAddStudent);

router.get('/get-students',auth, controller.getStudentList);
router.post('/get-studentsByClass',auth, controller.getStudentByClass);
router.post('/get-studentById',auth, controller.getStudentById);
router.get('/',controller.login);
router.post('/home',controller.postLogin,auth);
router.get('/home',auth,controller.home);
router.get('/register',controller.getRegister);
router.post('/register',[
    check('email').isEmail().withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
        return  user.find({email:value}).then(userDoc => {
            if (userDoc.length>0) {
              return Promise.reject(
                'E-Mail exists already, please pick a different one.'
              );
            }
          });
        }),
          body('confirm_password').custom((value, { req }) => {
            if (value !== req.body.password) {
              throw new Error('Passwords have to match!');
            }
            return true;
          })
],controller.postRegister);
router.post('/logout',auth,controller.postLogout);
router.get('/logout',auth,controller.postLogout);
router.get('/forgotPassword',controller.getForgot);
router.post('/forgotPassword', controller.postForgot);
router.post('/passwordUpdated' ,controller.postUpdatePassword);
router.get('/addBook',auth,controller.getAddBook);

router.post('/addBook',auth,[body('bookId').custom((value, { req }) => {
  console.log(value<0);
  if (value < 0) {
    console.log(value);
    throw new Error('Book ID Can not be Negative');
  }

  return true; 
}),
check('name').isAlphanumeric.withMessage('Name Can Only Contain Alphabets and Numbers'),
check('author').isAlphanumeric.withMessage('Author Name Can Only Contain Alphabets and Numbers')
],controller.postAddBook);

router.get('/getBooks',auth,controller.getBooks);
router.post('/getBookByAuthor',auth,controller.getBookByAuthor);
router.post('/getByCategory',auth,controller.getBookByGener);
router.post('/getBookById',auth,controller.getBookById);
router.get('/issue',auth,controller.getIssue);
router.post('/getdata',auth,controller.getdata);
router.post('/issued',auth, controller.issued);
router.get('/issueHistory',auth,controller.issueHistory);
router.post('/filter',auth,controller.filter);
router.get('/update',auth,controller.updatestock);
router.get('/search',auth,controller.updatestock);
router.post('/search',auth,controller.searchbook);
router.post('/update',auth,controller.updateqty);
router.post('/deleteStudent',auth, controller.postdelete);
router.get('/deleteStudent',auth, controller.getdelete);
router.post('/searchstu',auth, controller.searchstu);
router.get('/searchstu',auth, controller.getdelete);
router.get('/searchStudent',auth, controller.getsearchStudent);
router.post('/searchStudent',auth, controller.postsearchStudent);
router.post('/returnBook',auth, controller.postReturnBook);


module.exports = router;