const Sequelize = require("sequelize");
const db = new Sequelize("postgres://rafavillalopez:rafita981@localhost:5432/wiki");

// const Page = require("./Page")

module.exports = db

