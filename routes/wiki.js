const models = require("../models");
const Page = models.Page;
const User = models.User;
const router = require("express").Router();

router.get("/", function (req, res, next) {
  res.redirect("/");
});

router.post("/", async (req, res, next) => {
  const { name, email, title, content } = req.body;
  try {
    const userArrP = User.findOrCreate({
      where: {
        firstName: name,
        email,
      },
    });

    const pageP = Page.create({
      title,
      content,
    });

    const [page, user] = await Promise.all([pageP, userArrP]);

    await page.setAuthor(user[0]);

    res.redirect(page.route);
  } catch (err) {
    next(err);
  }
});

router.get("/add", (req, res, next) => {
  res.render("addpage");
});

router.get("/:urlTitle", async (req, res, next) => {
  const { urlTitle } = req.params;
  try {
    const page = await Page.findOne({
      where: {
        urlTitle,
      },
    });
    const user = await User.findOne({
      where: {
        id: page.authorId,
      },
    });
    res.render("wikipage", { page, user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
