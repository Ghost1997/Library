const student = require('../model/student_model');
const user = require('../model/user_model');
const books = require('../model/book_model');
const issue = require('../model/issue_model');
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');


let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: "workmail.sujit@gmail.com",
    pass: "7974638557"
  }
});

exports.getRegister = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('register', {
    pageTitle: 'Registration',
    path: '/registration',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });
};

exports.postRegister = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //console.log(errors.array());
    return res.status(422).render('register', {
      path: '/register',
      pageTitle: 'Register',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirm_password,
        oname: name
      }
    });
  }
  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const us = new user({
        email: email,
        password: hashedPassword,
        name: name

      });
      return us.save();
    })
    .then(result => {
      req.flash(
        'error',
        'User Created Successfully'
      )
      res.redirect('<%= process.env.HOST %>/');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getAddStudent = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('addStudent', {
    pageTitle: 'Add Student',
    path: '/add-person',
    errorMessage: message,
    student: {
      roll: "",
      clas: "",
      name: "",
      section: "",
      gender: "",
      email: "",

    }
  });
};

exports.login = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('login1', {
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.postAddStudent = (req, res, next) => {

  const roll = req.body.roll_no;
  const clas = req.body.class;
  const name = req.body.name;
  const section = req.body.section;
  const gender = req.body.gender;
  const email = req.body.email;
  const libNo = clas + section + roll;
  const image = req.file;
  if (!image) {
    return res.status(422).render('addStudent', {
      pageTitle: 'Add Student',
      student: {
        roll: roll,
        clas: clas,
        name: name,
        section: section,
        gender: gender,
        email: email,

      },
      errorMessage: 'Attached file is not an image.',
      validationErrors: []
    });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //console.log(errors.array());
    return res.status(422).render('addStudent', {
      pageTitle: 'Add Student',
      editing: false,
      hasError: true,
      student: {
        roll: roll,
        clas: clas,
        name: name,
        section: section,
        gender: gender,
        email: email

      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  student.find({ lib_no: libNo } ).then(userDoc => {
    if (userDoc.length > 0) {
      req.flash(
        'error',
        'Student Already Exist, Please Check and Try Again'
      )
      return res.redirect('/add-student');
    };
    const imageUrl = image.path;
    const stu = new student({
      lib_no: libNo,
      roll_no: roll,
      name: name,
      std: clas,
      section: section,
      email: email,
      gender: gender,
      image: imageUrl
    })
    stu.save().then(() => {

      transporter.sendMail({
        to: email,
        from: 'workmail.sujit@gmail.com',
        subject: 'Library ID is created',
        html: `<h2>Hello! ${name},</h2><h3>Its good to have you as our member. Your Library ID is "${libNo}".May we request you please note it down for your further transaction.</h3> <br><br><br><br><p>Regards,<br/>Team Admin</p>`
      }, (err, info) => {
        if (err) {
          console.log(err);
        }
        else {
          console.log(info);
        }
      });
      res.render('addStudent', {
        pageTitle: 'Add Student',
        errorMessage: 'Student Added Successfull Please Check Your Email',
        student: {
          roll: "",
          clas: "",
          name: "",
          section: "",
          gender: "",
          email: "",
          image: ""

        }

      });

    }).catch(err => {
      console.log(err);
    });
  })
}



exports.getStudentList = (req, res, next) => {
  student.find().then(student => {
    res.render('getStudent', {
      data: student,
      pageTitle: 'All Students'
    });
  }).catch(err => console.log(err));
};

exports.home = (req, res, next) => {
  res.render('home', {
    pageTitle: 'Home',
    path: '/Home',
    formsCSS: true,
    product: true,
    activeAddPerson: true
  });
};

exports.getStudentByClass = (req, res, next) => {
  const clas = req.body.clas;
  student.find({ std: clas } ).then(student => {
    res.render('getStudent', {
      data: student,
      pageTitle: 'Student By Class',
      path: '/admin/get-studentsByClass'
    });
  }).catch(err => console.log(err));
};

exports.getStudentById = (req, res, next) => {
  const lib = req.body.no
  student.find({ lib_no: lib }).then(student => {
    res.render('getStudent', {
      data: student,
      pageTitle: 'Student By Library No',
      path: '/admin/get-studentById'
    });
  }).catch(err => console.log(err));
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  user.find({ email: email }).then(us => {
    if (us.length == 0) {
      req.flash('error', 'Invalid Email or Password.');
      return res.redirect('/');
    }
    bcrypt.compare(password, us[0].password).then(doMatch => {
      if (doMatch) {
        req.session.isLoggedIn = true;
        req.session.us = us;
        return req.session.save(() => {
          res.render('home', {
            pageTitle: 'Home ',
            path: '/home'
          });
        });
      }
      req.flash('error', 'Invalid Email or Password.');
      res.redirect('/');
    })
      .catch(err => {
        console.log(err);
        res.redirect('/');
      });
  })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
  
    res.redirect('/');
  });
};

exports.getForgot = (req, res, next) => {
  res.render('forgotpass', {
    pageTitle: 'Forgot Password',
    errorMessage: ''
  });
};


exports.postForgot = (req, res, next) => {
  email = req.body.email;
  user.find({ email: email }).then(users => {
    if (users.length == 0) {
      res.render('forgotpass', {
        pageTitle: 'Forgot Password',
        errorMessage: 'Email Id Not Found'
      });
    };

    otp = Math.floor(100000 + Math.random() * 900000);

    if (users.length > 0) {
      name = users[0].name;
      transporter.sendMail({
        to: email,
        from: 'workmail.sujit@gmail.com',
        subject: 'Forgot Password',
        html: `<h1>Hello! "${name}"<h3>Your Email is "${email}" and Your OTP is "${otp}"</h3>`
      }, (err, info) => {
        if (err) {
          console.log(err);
        }
        else {
          console.log(info);
        }
      });
      const us = new user({
        _id:users[0]._id,
        email:users[0].email,
        password:users[0].password,
        otp:otp
      })
      user.update({ email: email },us
      
      ).then(() => {
        res.render('updatepass', {
          pageTitle: 'Update Password',
          errorMessage: 'OTP is sent your email',
          data: {
            email: email
          }
        });
      })
    }
  })

};

exports.postUpdatePassword = (req, res, next) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const password = req.body.password;
  const cpassword = req.body.confirmPassword;
  user.find({ otp: otp } ).then(users => {
    if (users.length == 0) {
      res.render('forgotpass', {
        pageTitle: 'Forgot Password',
        errorMessage: 'OTP is incorrect'
      });
    }
    if (users.length > 0) {
      if (password === cpassword) {
        bcrypt.hash(password, 12).then(hashedPassword => {
          const us = new user({
            _id:users[0]._id,
            email:users[0].email,
            password:hashedPassword,
            otp:users[0].otp
          })
          user.update({ otp: users[0].otp },us
          
          ).then(result => {
            res.render('login1', {
              pageTitle: 'Login',
              errorMessage: 'Password Updated Sucessfully'
            });
              
            })
            .catch(err => {
              console.log(err);
            });
        })

      }
      else {
        res.render('forgotpass', {
          pageTitle: 'Forgot Password',
          errorMessage: 'Password has to match'
        })
      }
    };
  })
}

exports.getAddBook = (req, res, next) => {
  res.render('addbook', {
    pageTitle: 'Add Book',
    errorMessage: '',
    book: {
      bookid: '',
      name: '',
      qty: '',
      days: '',
      cost: '',
      author: ''
    }
  });
};

exports.postAddBook = (req, res, next) => {
  const id = req.body.bookId;
  const author = req.body.author;
  const name = req.body.name;
  const type = req.body.type;
  const cost = req.body.cost;
  const qty = req.body.qty;
  const days = req.body.days;

  books.find({ bookId: id }).then(userDoc => {
    if (userDoc.length > 0) {
      res.render('addbook', {
        pageTitle: 'Add Book',
        errorMessage: 'Duplicate BookId',
        book: {
          bookId: id,
          author: author,
          name: name,
          type: type,
          issue_days: days,
          cost: cost,
          qty: qty
        }
      })
    }
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //console.log(errors.array());
    return res.status(422).render('addbook', {
      pageTitle: 'Add Book',
      editing: false,
      hasError: true,
      book: {
        bookId: id,
        author: author,
        name: name,
        type: type,
        issue_days: days,
        cost: cost,
        qty: qty
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
    else if (qty <= 0 || cost <= 0 || days <= 0) {
      res.render('addbook', {
        pageTitle: 'Add Book',
        errorMessage: 'Cost, Quantity and Days of Issue cant be Negative or Zero',
        book: {
          bookId: id,
          author: author,
          name: name,
          type: type,
          issue_days: days,
          cost: cost,
          qty: qty
        }
      })
    }
    else {
      const book = new books({
        bookId: id,
        author: author,
        name: name,
        type: type,
        issue_days: days,
        cost: cost,
        qty: qty
      })
      book.save().then(() => {
        res.render('addbook', {
          pageTitle: 'Add Book',
          errorMessage: 'Book Added Successfull',
          book: {
            bookid: '',
            name: '',
            qty: '',
            days: '',
            cost: '',
            author: ''
          }
        });
      }).catch(err => {
        console.log(err);
      });
    }
  })
}

exports.getBooks = (req, res, next) => {
  books.find().then(book => {
    res.render('getBooks', {
      data: book,
      pageTitle: 'All Books'
    });
  }).catch(err => console.log(err));

};
exports.getBookByAuthor = (req, res, next) => {
  const author = req.body.author;
  books.find({ author: author }).then(book => {
    res.render('getBooks', {
      data: book,
      pageTitle: 'Books By Author',
    });
  }).catch(err => console.log(err));
};
exports.getBookByGener = (req, res, next) => {
  const gener = req.body.gener;
  books.find({ type: gener }).then(book => {
    res.render('getBooks', {
      data: book,
      pageTitle: 'Books By Gener',
    });
  }).catch(err => console.log(err));
};

exports.getBookById = (req, res, next) => {
  const id = req.body.id
  books.find({ bookId: id }).then(book => {
    res.render('getBooks', {
      data: book,
      pageTitle: 'Student By Library No',
      path: '/admin/get-studentById'
    });
  }).catch(err => console.log(err));
};

exports.getIssue = (req, res, next) => {
  res.render('getdata', {
    pageTitle: 'Issue Books',
    errorMessage: '',
    issue: {
      bookid: '',
      lib_no: '',
      name: '',
      bookname: '',
      issuedate: '',
      duedate: '',
      author: ''
    }
  });
};

exports.getdata = (req, res, next) => {
  const libno = req.body.lib_no;
  const bookid = req.body.bookId;
  const issuedate = req.body.issuedate;
  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }
  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }

  let std = {};
  student.find({ lib_no: libno }).then(stu => {
    if (stu.length > 0) {
      std = {
        lib_no: libno,
        name: stu[0].name,
      }
      books.find({ bookId: bookid }).then(book => {
        if (book.length > 0) {
    
          const due = new Date(issuedate);
          const days = book[0].issue_days;
          const newdate = formatDate((due.addDays(days)));
          res.render('issue', {
            data: book,
            pageTitle: 'Issue Books',
            errorMessage: '',
            issue: {
    
              lib_no: std.lib_no,
              name: std.name,
              bookid: bookid,
              bookname: book[0].name,
              author: book[0].author,
              issuedate: issuedate,
              duedate: newdate
            }
          });
        }
        else {
          res.render('getdata', {
            data: book,
            pageTitle: 'Issue Books',
            errorMessage: 'Invalid Book ID or Student ID',
            issue: {
              bookid: '',
              lib_no: '',
              name: '',
              bookname: '',
              issuedate: '',
              duedate: '',
              author: ''
            }
          })
        }
      }).catch(err => console.log(err));
    }
    else {
      res.render('getdata', {
        data: [],
        pageTitle: 'Issue Books',
        errorMessage: 'Invalid Book ID or Student ID',
        issue: {
          bookid: '',
          lib_no: '',
          name: '',
          bookname: '',
          issuedate: '',
          duedate: '',
          author: ''
        }
      })
    }

  }).catch(err => console.log(err));

  

};

exports.issued = (req, res, next) => {
  const libno = req.body.lib_no;
  const name = req.body.name;
  const bookid = req.body.bookId;
  const issuedate = req.body.issuedate;
  const duedate = req.body.duedate;
  const bookname = req.body.bookname;
  const author = req.body.author;
  const id = libno + bookid;
  let book = {};
  books.find({ bookId: bookid } ).then(issued => {
    book = {
      qty: issued[0].qty
    }


  })



  issue.find({ issueId: id }).then(issued => {
    if (issued.length > 0) {
      res.render('getdata', {
        pageTitle: 'Isuue Book',
        errorMessage: 'Book Already Issued Check and try again',
        issue: {
          bookid: bookid,
          lib_no: libno,
          name: name,
          bookname: bookname,
          issuedate: issuedate,
          duedate: duedate,
          author: author
        }

      })
    }

    else if (book.qty === 0) {
      res.render('getdata', {
        pageTitle: 'Isuue Book',
        errorMessage: 'Book Is Out of Stock',
        issue: {
          bookid: bookid,
          lib_no: libno,
          name: name,
          bookname: bookname,
          issuedate: issuedate,
          duedate: duedate,
          author: author
        }
      })
    }
    else {

      const iss = new issue({
        issueId: id,
        lib_no: libno,
        name: name,
        bookId: bookid,
        bookname: bookname,
        issuedate: issuedate,
        duedate: duedate,
        author: author
      })
      iss.save().then(() => {
        res.render('getdata', {
          pageTitle: 'Issue Book',
          errorMessage: 'Book Issued Successfull',
          issue: {
            bookid: '',
            lib_no: '',
            name: '',
            bookname: '',
            issuedate: '',
            duedate: '',
            author: ''
          }
        });
      }).catch(err => {
        console.log(err);
      });

      books.find({ bookId: bookid }).then(boo => {
        const iss = new books({
        _id:boo[0]._id,
        qty: book.qty - 1
        })
        books.updateOne({ bookId: bookid },iss).then()

      })
    }
  })
}

exports.issueHistory = (req, res, next) => {
  issue.find().then(iss => {
    res.render('issueHistory', {
      data: iss,
      pageTitle: 'Issue History'
    });
  }).catch(err => console.log(err));

}

exports.filter = (req, res, next) => {
  const startDate = req.body.date1;
  const endDate = req.body.date2;
  issue.find({ issuedate: {
    $gte: startDate,
    $lte: endDate
  }
  }).then(iss => {
    res.render('issuehistory', {
      data: iss,
      pageTitle: 'Issue History'
    });
  }).catch(err => console.log(err));

}

exports.updatestock = (req, res, next) => {

  res.render('updatestock', {
    data: [],
    condition: false,
    pageTitle: 'Update Stock',
    errorMessage: '',
    value: ''
  });

}

exports.searchbook = (req, res, next) => {
  bookid = req.body.bookid
  books.find({ bookId: bookid } ).then(book => {
    if (book.length == 0) {
      res.render('updatestock', {
        condition: false,
        data: book,
        value: '',
        pageTitle: 'Update Stock',
        errorMessage: 'No Book Found'
      });
    }
    else {
      res.render('updatestock', {
        condition: true,
        data: book,
        value: bookid,
        pageTitle: 'Update Stock',
        errorMessage: ''
      });
    }
  }).catch(err => console.log(err));
}

exports.updateqty = (req, res, next) => {
  qty = req.body.qty;
  bookid = req.body.bookid;
  
  books.find({ bookId: bookid }).then(boo => {
    const iss = new books({
    _id:boo[0]._id,
    qty: qty
    })
    books.updateOne({ bookId: bookid },iss).then(() => {
    res.render('updatestock', {
      pageTitle: 'Update Stock',
      errorMessage: 'Stock Updated',
      value: '',
      condition: false,

    });

  })
})
}
exports.getdelete = (req, res, next) => {
  res.render('deleteStudent', {
    data: [],
    condition: false,
    value: '',
    pageTitle: 'Delete Student',
    errorMessage: '',
  });
}
exports.postdelete = (req, res, next) => {
  id = req.body.id;
  student.deleteOne({
      lib_no: id
    }).then(() => {
    res.render('deleteStudent', {
      condition: false,
      value: '',
      pageTitle: 'Delete Student',
      errorMessage: 'Student Removed'
    });
  })

}
exports.searchstu = (req, res, next) => {
  id = req.body.stuid;
  student.find({ lib_no: id }).then(stu => {
    if (stu.length == 0) {
      res.render('deleteStudent', {
        condition: false,
        data: stu,
        value: '',
        pageTitle: 'Delete Student',
        errorMessage: 'No Student Found'
      });
    }
    else {
      res.render('deleteStudent', {
        condition: true,
        data: stu,
        value: id,
        pageTitle: 'Delete Student',
        errorMessage: ''
      });
    }
  }).catch(err => console.log(err));
}

exports.getsearchStudent = (req, res, next) => {
  res.render('pofile', {
    condition: false,
    pageTitle: 'profile',
    errorMessage: '',
  });

}

exports.postsearchStudent = (req, res, next) => {
  id = req.body.id;
  var todayDate = new Date().toISOString().slice(0, 10);
  student.find({ lib_no: id }).then(stu => {
    if (stu.length == 0) {
      res.render('pofile', {
        condition: false,
        value: '',
        pageTitle: 'Profile',
        errorMessage: 'No Student Found'
      });
    }
    else {
      // issue.find({
      //     duedate: {
      //       $lt: todayDate
      //     }
      // }).then(issu => {
      //   data2: issu
      // }).catch(err => console.log(err));

      issue.find({ lib_no: id }).then(iss => {
        issue.find({
            duedate: {
              $lt: todayDate
            }
        }).then(issu => {
        res.render('pofile', {
          condition: true,
          data: stu,
          pageTitle: 'Profile',
          errorMessage: '',
          data1: iss,
          data2:issu
        }
        );
        
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));


    }
  }).catch(err => console.log(err));
}


exports.postReturnBook = (req, res, next) => {
  const id = req.body.id;
  const bookid = req.body.book;
  
  books.find({ bookId: bookid } ).then(issued => {
    const boo = new books({
      _id:issued[0]._id,
      qty:issued[0].qty + 1
    }
      
    )
    
  books.update({
      bookId: bookid
    },boo).then()
})

issue.deleteOne({
      issueId: id
  }).then(() => {
    res.render('pofile', {
        condition: false,
        value: '',
        pageTitle: 'Profile',
        errorMessage: 'Book Returned'
    });
  })

}


exports.get404 = (req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404' });
};
