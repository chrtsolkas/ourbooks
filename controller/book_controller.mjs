import * as BookList from './../model/bookList_model.mjs'
// import { Book, BookUser } from './../model/bookList_seq_PostgreSQL.mjs'

async function showBookList(req, res, next) {
  try {
    const myBooks = await BookList.loadBooks(req.session.username)
    res.render("booklist", { books: myBooks, username: req.session.username })
  } catch (error) {
    next(error)
  }

}

const addBook = async (req, res, next) => {
  try {
    await BookList.addBook({
      "title": req.body["newBookTitle"],
      "author": req.body["newBookAuthor"]
    },
      req.session.username)
    next()

  } catch (error) {
    next(error)
  }
}

const deleteBook = async (req, res, next) => {
  const title = req.params.title
  try {
    await BookList.deleteBook({
      title: title
    },
      req.session.username)
    next()
  } catch (error) {
    next(error)
  }
}

// Show book comments form
async function showBookComments(req, res, next) {
  try {
    // At first we find the book (we need the author)
    const book = await BookList.findBook(req.params.title)
    // Then we find the user's comment on the book
    const bookUser = await BookList.loadUserComment(book, req.session.username)
    // Lastly we find comments from other users on the book
    const bookOtherComments = await BookList.loadOtherComments(book, req.session.username)
    // Render the form
    res.render("addcommentform", {
      bookTitle: book.title,
      bookAuthor: book.author,
      bookComment: await bookUser.getDataValue('comment'),
      otherComments: bookOtherComments,
      username: req.session.username
    })
  } catch (error) {
    next(error)
  }
}

const updateBookComment = async (req, res, next) => {
  try {
    // Update the book comment of the user
    await BookList.updateBookComment(req.body["bookComment"], req.body["bookTitle2"], req.session.username)
    next()

  } catch (error) {
    next(error)
  }
}


export { showBookList, addBook, deleteBook, showBookComments, updateBookComment  }