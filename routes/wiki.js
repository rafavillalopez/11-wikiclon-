const models = require("../models");
const Page = models.Page;
const User = models.User;
const router = require("express").Router();

router.get("/", function (req, res, next) {
  res.redirect("/");
});

router.post("/", (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const name = req.body.name;
  const mail = req.body.email;

  createPage(title, content)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err)); 
});

router.get("/add", function (req, res, next) {
  res.render("addpage");
});

async function createPage(title, content) {
  let page = await Page.create({
    title: title,
    content: content,
  });
  return page
}

module.exports = router;
