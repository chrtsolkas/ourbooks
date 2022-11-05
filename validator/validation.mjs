import { body, validationResult } from 'express-validator'
import validator from 'validator'

const validateLogin = [
    body("username")
        .trim().escape().isLength({ min: 4 })
        .withMessage("Το όνομα χρήστη πρέπει να περιέχει τουλάχιστον 4 χαρακτήρες"),

    (req, res, next) => {
        const errors = validationResult(req)

        if (errors.isEmpty()) {
            next()
        }
        else {
            res.render('home', { message: errors.mapped() })
        }
    }
]

const validateNewBook = [
    body("newBookTitle")
    .trim()
    .escape()
    .custom(value => {
        for(let ch of value) {
            if (!validator.isAlpha(ch, 'el-GR') && 
            !validator.isAlpha(ch, 'en-US') &&
            !validator.isNumeric(ch, 'en-US') && 
            ch != ' ' && ch != '-' && ch != ',' && ch != '.' && ch != '?' && ch != ':' && ch != ';') {
                throw new Error("Στον τίτλο του βιβλίου επιτρέπονται ελληνικοί και λατινικοί χαρακτήρες")
            }
        }
        return true
    })
    .isLength({ min: 5 })
    .withMessage("Ο τίτλος πρέπει να περιέχει τουλάχιστον 5 γράμματα")
  ,
  body("newBookAuthor")
    .trim()
    .escape()
    .custom(value => {
        for(let ch of value) {
            if (!validator.isAlpha(ch, 'el-GR') && 
            !validator.isAlpha(ch, 'en-US') &&
             ch != ' ' && ch != '-' && ch != ',' && ch != '.' && ch != "'") {
                throw new Error("Στους συγγραφείς του βιβλίου επιτρέπονται ελληνικοί και λατινικοί χαρακτήρες")
            }
        }
        return true
    })
    .isLength({ min: 5 })
    .withMessage("Οι συγγραφείς πρέπει να περιλαμβάνουν τουλάχιστον 5 χαρακτήρες")
  ,
    (req, res, next) => {
        const errors = validationResult(req)

        if (errors.isEmpty()) {
            next()
        }
        else {
            res.render("addbookform", {
                message: errors.mapped(),
                title: req.body["newBookTitle"],
                author: req.body["newBookAuthor"]
              })
        }
    }
]

const validateNewUser = [
    body("username")
    .trim().escape().isLength({ min: 4 })
    .withMessage("Το όνομα χρήστη πρέπει να περιέχει τουλάχιστον 4 χαρακτήρες") 
  ,
  body("password-confirm")
    .trim().isLength({ min: 4, max: 10 })
    .withMessage("Το συνθηματικό χρήστη πρέπει να περιέχει τουλάχιστον 4 χαρακτήρες και όχι περισσότερους από 10 χαρακτήρες")
    .custom((value, { req }) => {
      if (value != req.body.password)
        throw new Error("Το συνθηματικό δεν ταιριάζει με την επιβεβαίωση συνθηματικού")
      else
        return true
    })
  ,
    (req, res, next) => {
        const errors = validationResult(req)

        if (errors.isEmpty()) {
            next()
        }
        else {
            res.render("registrationform", {
                message: errors.mapped()
              })
        }
    }
]

export { validateLogin, validateNewBook, validateNewUser }