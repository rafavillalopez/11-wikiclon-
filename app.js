const express = require("express");
const morgan = require("morgan");
const app = express();
const nunjucks = require("nunjucks");
const routes = require("./routes");
const db = require("./db");

// MORGAN
app.use(morgan("tiny"));

//PARSSERS
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//STATICS
app.use(express.static("./public"));

//NUNJUCKS
const env = nunjucks.configure("views", { noCache: true }); // Se utilizará ára MD
app.set("view engine", "html");
app.engine("html", nunjucks.render);

//ROUTES

app.use("/", routes);

// ERROR MIDDLEWARE

app.use((error, req, res, next) => {
  console.log(error);
  res.render("error", { message: "Ups, hubo un problema", error });
});

// RUN SERVER
const port = 3000;
runServer(port);

async function runServer(port) {
  try {
    await db.sync({ force: false });
    console.log("Nos hemos conectado a la base de datos");
    app.listen(port, () => {
      console.log(`La app ha arrancado en http://localhost:${port}`);
    });
  } catch (err) {
    console.log("Se ha producido un error", err);
  }
}
