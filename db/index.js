const Sequelize = require('sequelize')
const db = new Sequelize("postgres://demian:routes@localhost:5432/wiki", {
    logging: false
});


module.exports = db;

