const express = require('express');

const controller = require('../controllers/mapping');

const user = require('../model/user_model');
const book = require('../model/book_model');

const { check, body } = require('express-validator/check');

const auth =require('../operations/auth')

const router = express.Router();

router.get('/add-student',auth,controller.getAddStudent);
router.post('/add-student',auth, controller.postAddStudent);
router.get('/get-students',auth, controller.getStudentList);
router.post('/get-studentsByClass',auth, controller.getStudentByClass);
router.post('/get-studentById',auth, controller.getStudentById);
router.get('/login',controller.login);
router.post('/home',controller.postLogin,auth);
router.get('/home',auth,controller.home);
router.get('/message',auth,controller.message);
router.get('/register',controller.getRegister);
router.post('/register',[
    check('email').isEmail().withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
        return  user.findAll({where : {email:value}}).then(userDoc => {
            if (userDoc.length>0) {
              return Promise.reject(
                'E-Mail exists already, please pick a different one.'
              );
            }
          });
        }),body(
            'password',
            'Please enter a password with only numbers and text and at least 5 characters.'
          )
            .isLength({ min: 5 })
            .isAlphanumeric(),
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
router.post('/addBook',auth,controller.postAddBook);
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