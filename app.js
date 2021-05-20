const express = require("express");
const morgan = require("morgan");
const app = express();
const nunjucks = require("nunjucks");
const routes = require("./routes");
const sequelize = require("sequelize");
const db = require("./models");

// MORGAN
app.use(morgan("tiny"));

//PARSSERS
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//STATICS
app.use(express.static("./public"));

//NUNJUCKS
var env = nunjucks.configure("views", { noCache: true }); // Se utilizará ára MD
app.set("view engine", "html");
app.engine("html", nunjucks.render);

app.use("/", routes);

const port = 3000;
const url = "http://localhost:3000";

db.sync({ force: true })
  .then(() => {
    app.listen(port, () => {
      console.log("server creado y escuchando en " + url);
    });
  })
  .catch((err) => console.log(err));
