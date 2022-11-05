import { User, Book, BookUser } from './bookList_seq_PostgreSQL.mjs'
import bcrypt from 'bcrypt'
import { Op } from 'sequelize'


async function addUser(username, password) {
    try {
        if (!username || !password)
            throw new Error("Το όνομα χρήστη ή το συνθηματικό χρήστη δεν έχει λάβει τιμή")

        let user = await User.findOne({ where: { name: username } })

        if (user)
            throw new Error("Υπάρχει ήδη ο χρήστης με όνομα " + username)

        const hash = await bcrypt.hash(password, 10)
        user = await User.create({ name: username, password: hash })
        console.log("addUser: ", user)

        return user
    } catch (error) {
        throw error
    }
}

async function login(username, password) {
    try {
        if (!username || !password)
            throw new Error("Το όνομα χρήστη ή το συνθηματικό χρήστη δεν έχει λάβει τιμή")

        let user = await User.findOne({ where: { name: username } })
        // console.log("login:" + user)
        if (!user)
            throw new Error("Δεν υπάρχει ο χρήστης με όνομα " + username)

        const match = await bcrypt.compare(password, user.password)
        if (match)
            return user
        else
            throw new Error("Λανθασμένα στοιχεία πρόσβασης. Προσπαθήστε ξανά.")

    } catch (error) {
        throw error
    }
}

async function loadBooks(username) {
    try {
        if (!username)
            throw new Error("Δεν έχει δοθεί όνομα χρήστη")
        const user = await User.findOne({ where: { name: username } })
        if (!user)
            throw new Error("Δεν υπάρχει ο χρήστης με όνομα " + username)

        // console.log("------> ", this.user, "<<<<<<<<<<")
        const myBooks = await user.getBooks({ raw: true })
        return myBooks
        // console.log(this.myBooks)
    } catch (error) {
        // let the caller handle the error
        throw error
    }
}

async function addBook(newBook, username) {
    try {
        // At first find the user
        if (!username)
            throw new Error("Δεν έχει δοθεί όνομα χρήστη")

        const user = await User.findOne({ where: { name: username } })
        if (!user)
            throw new Error("Δεν υπάρχει ο χρήστης με όνομα " + username)

        // try to find the book
        const bookFound = await Book.findByPk(newBook.title)

        if (!bookFound) {
            const [book, book_created] = await Book.findOrCreate({
                where: {
                    title: newBook.title,
                    author: newBook.author
                }
            })


            // Add the book to user's collection
            await user.addBook(book)
        }
        else {
            await user.addBook(bookFound)
        }
    } catch (error) {
        throw error
    }
}

async function deleteBook(book, username) {
    try {
        // At first find the user
        if (!username)
            throw new Error("Δεν έχει δοθεί όνομα χρήστη")

        const user = await User.findOne({ where: { name: username } })
        if (!user)
            throw new Error("Δεν υπάρχει ο χρήστης με όνομα " + username)

        // try to find the book to remove
        const bookToRemove = await Book.findOne({
            where: {
                title: book.title
            }
        })

        // Remove the user from the book
        await bookToRemove.removeUser(user)
        // await this.user.removeBook(bookToRemove) // another way

        // check if other users have the book
        const numberOfUsers = await bookToRemove.countUsers()
        // if no other user has the book then remove it
        if (numberOfUsers == 0) {
            Book.destroy({
                where: {
                    title: book.title
                }
            })
        }

    } catch (error) {
        throw error
    }
}


async function findBook(bookTitle) {
    try {
        let book = await Book.findByPk(bookTitle)
        if (!book)
            throw new Error("Δεν βρέθηκε το βιβλίο με τίτλο " + bookTitle)

        return book
    } catch (error) {
        throw error
    }
}

async function loadUserComment(book, username) {
    try {
        let bookUser = await BookUser.findOne({
            where: {
                BookTitle: book.title,
                UserName: username
            }
        })
        if (!bookUser)
            throw new Error("Δεν βρέθηκε το βιβλίο με τίτλο " + book.title + " του χρήστη " + username)

        return bookUser
    } catch (error) {
        throw error
    }

}

async function loadOtherComments(book, username) {
    try {
        let bookOtherComments = await BookUser.findAll({
            where: {
                [Op.and]: [
                    { BookTitle: book.title },
                    { UserName: { [Op.ne]: username } }, // UserName != req.session.username
                    { comment: { [Op.not]: null } }, // comment IS NOT NULL,
                    { comment: { [Op.ne]: "" } } // comment != ""
                ]
            },
            attributes: ["UserName", "comment"], // SELECT UserName, comment
            raw: true
        })

        if (!bookOtherComments)
            throw new Error("Δεν βρέθηκαν σχόλια από άλλους χρήστες για το βιβλίο με τίτλο " + book.title)

        return bookOtherComments

    } catch (error) {
        throw error
    }
}

async function updateBookComment(bookComment, bookTitle, username) {
    try {
        await BookUser.update(
            { comment: bookComment },
            {
                where: {
                    BookTitle: bookTitle,
                    UserName: username
                }
            })
    } catch (error) {

    }
}

export { addUser, login, loadBooks, addBook, deleteBook, findBook, loadUserComment, loadOtherComments, updateBookComment }