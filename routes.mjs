import express from 'express'

// import { BookList } from './bookList.mjs'
// import * as BookList from './model/bookList_model.mjs'
import * as Validator from './validator/validation.mjs'
import * as UserController from './controller/user_controller.mjs'
import * as BookController from './controller/book_controller.mjs'

// import { User, Book, BookUser } from './model/bookList_seq_PostgreSQL.mjs'
// import { Op } from 'sequelize'

const router = express.Router()

router.get(
  '/',
  (req, res) => {
    // show template home.hbs
    res.render("home")
  }
)

router.get(
  '/books',
  UserController.checkIfAuthenticated,
  BookController.showBookList
)

router.post(
  '/books',
  (req, res, next) => {
    req.session.username = req.body['username']
    next()
  },
  UserController.checkIfAuthenticated,
  Validator.validateLogin,
  UserController.doLogin,
  BookController.showBookList
)

router.get(
  '/addbookform',
  UserController.checkIfAuthenticated,
  (req, res) => {
    res.render("addbookform", {username: req.session.username})
  }
)

router.post(
  '/doaddbook',
  UserController.checkIfAuthenticated,
  Validator.validateNewBook,
  BookController.addBook,
  BookController.showBookList
)

router.get(
  '/delete/:title',
  UserController.checkIfAuthenticated,
  BookController.deleteBook,
  BookController.showBookList
)

router.get(
  '/comment/:title',
  UserController.checkIfAuthenticated,
  BookController.showBookComments
)

router.post(
  '/addcomment',
  UserController.checkIfAuthenticated,
  BookController.updateBookComment,
  BookController.showBookList
)

router.get(
  '/logout',
  UserController.checkIfAuthenticated,
  UserController.doLogout,
  (req, res) => {
    res.redirect('/')
  }
)

router.get(
  '/register',
  (req, res) => {
    res.render("registrationform")
  }
)

router.post(
  '/doregister',
  Validator.validateNewUser,
  UserController.doRegister
)





export { router }