# ourBooks

Η εφαρμογή ourBooks είναι μια απλή εφαρμογή διαχείρισης των βιβλίων μιας μικρής ομάδας φίλων.

Η εφαρμογή έχει δημοσιευτεί στο [Heroku](https://www.heroku.com/) και μπορείτε να την δοκιμάσετε στον ακόλουθο σύνδεσμο [ourBooks](https://our-books-app.herokuapp.com/)!



## Εκτέλεση σε τοπικό τερματικό

Για την εκτέλεση της εφαρμογής τοπικά πρέπει να εφαρμοστούν οι ακόλουθες αλλαγές:

- Πρέπει να αφαιρεθεί ο σχολιασμός των ακόλουθων γραμμών κώδικά και να συμπληρωθούν κατάλληλα οι τιμές στο αρχείο "bookList_seq_PostgreSQL.mjs":

```{JS}
// host: 'localhost',
// port: '5432',
// dialect: 'postgres',
// username: 'postgres',
// database: 'myBooks2',
// logging: false,
// define: {
//     timestamps: false,
//     freezeTableName: true
// }

```
- Πρέπει να σχολιαστούν οι ακόλουθες γραμμές κώδικα στο ίδιο αρχείο:

```
process.env.DATABASE_URL,

    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false,
    define: {
        timestamps: false,
        freezeTableName: true
    }
```


Πρέπει να μετονομάσετε το αρχείο ".env-example" σε ".env".

Για να ξεκινήσει η εφαρμογή τοπικά εκτελέστε τις ακόλουθες εντολές στο τερματικό σας:

```
npm install
node app.mjs
```
Η εφαρμογή είναι προσβάσιμη τοπικά στη διεύθυνση [localhost:3000](http://localhost:3000)

Η εφαρμογή έχει δοκιμαστεί με τη node.js 18.x και με βάση δεδομένων PostgreSQL 14.5.