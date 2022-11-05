import * as BookList from './../model/bookList_model.mjs'

const doLogin = async (req, res, next) => {

    try {
      const user = await BookList.login(req.body.username, req.body.password)
      // console.log("UserController.doLogin: ", user)
      if (user) {
        req.session.username = req.body.username
        res.locals.username = req.body.username
        next()
      }
      else {
        throw new Error("Παρουσιάστηκε άγνωστο σφάλμα κατά την αυθεντικοποίηση του χρήστη")
      }
    } catch (error) {

      next(error)
    }
  }

const doRegister = async (req, res, next) => {
    const username = req.body.username
    const password = req.body.password

    try {
      const user = await BookList.addUser(username, password)
      // req.session.username = username
      // console.log("doRegister:", username, password, user)
      if (user) {
        res.render('home', { newusermessage: "Η εγγραφή του νέου χρήστη πραγματοποιήθηκε" })
      }
      else {
        throw new Error("Παρουσιάστηκε άγνωστο σφάλμα κατά την εγγραφή του νέου χρήστη")
      }
    } catch (error) {
      next(error)
    }
  }


const doLogout = (req, res, next) => {
    req.session.destroy()
    next()
  }


function checkIfAuthenticated(req, res, next) {
    
    if (req.session.username) {
      // console.log ("Authenticated user: ", req.session.username)
      next()
    }
  
    else {
      // console.log ("Unauthenticated user! Redirecting home! ")
      res.redirect('/')
    }
  }

export { checkIfAuthenticated, doLogin, doRegister, doLogout }