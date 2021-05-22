const express = require("express");
const morgan = require("morgan");
const app = express();
const nunjucks = require("nunjucks");
const routes = require("./routes");
const db = require("./db");
require("./models/asociations");

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

// RUN SERVER
app.listen(port, async () => {
  try {
    console.log(`La app ha arrancado en http://localhost:${port}`);
    // Conectase a la base de datos
    // Force true: DROP TABLES
    await db.sync({ force: false });
    console.log("Nos hemos conectado a la base de datos");
  } catch (error) {
    console.log("Se ha producido un error", error);
  }
});
