import 'dotenv/config'
import express  from 'express'
import { engine } from 'express-handlebars'
import { router } from './routes.mjs'
import session from 'express-session'
import createMemoryStore from 'memorystore'


const MemoryStore = createMemoryStore(session)

const myBooksSession = session({
  secret: process.env.SESSION_SECRET,
  // reset every 24h
  store: new MemoryStore({ checkPeriod: 86400*1000 }), 
  resave: false,
  saveUninitialized: false,
  name: 'ourBooks-sid', // default connect.sid
  cookie: {
    maxAge: 1000 * 60 * 20 // 20 minutes
  }
})

const app = express()

// check sid
app.use(myBooksSession)

// load static files
app.use(express.static("public"))

// read variables send with POST
app.use(express.urlencoded({ extended: false }))

// Use .hbs as extention for handlebars files
app.engine('hbs', engine({ extname: '.hbs' }))
app.set('view engine', 'hbs')

// Use router for routing
app.use("/", router)

// Redirect to home
app.use((req, res) => {
  res.redirect('/')  
})

// Error handler
app.use((err, req, res, next) => {
  console.log(err.stack)
  // res.redirect('/')
  res.render('error', {message: err.message})
})
// Start app in listening mde on port PORT
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("Η εφαρμογή ξεκίνησε στην πόρτα: " + PORT)) 
