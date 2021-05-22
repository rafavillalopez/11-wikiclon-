const { Page, User } = require("../models");
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
  if (err) next(err);
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
    const tags = await page.getTags();

    res.render("wikipage", { page, user, tags });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
