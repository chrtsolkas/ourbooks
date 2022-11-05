import { Sequelize } from 'sequelize'


const sequelize = new Sequelize(
    // For heroku and flu.io
    // https://help.heroku.com/QD1AIH8R/how-do-i-use-sequelize-to-connect-to-heroku-postgres
    process.env.DATABASE_URL,
    {
        dialect: 'postgres',
        logging: false,
        define: {
            timestamps: false,
            freezeTableName: true
        },
        // only for heroku that uses SSL
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
        

        // for local use
        // host: 'localhost',
        // port: '5432',
        // dialect: 'postgres',
        // logging: false,
        // define: {
        //     timestamps: false,
        //     freezeTableName: true
        // },
        // username: 'postgres',
        // database: 'myBooks2'
    })

    export default sequelize