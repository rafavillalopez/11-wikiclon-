const { Page, User } = require("../models");
const router = require("express").Router();

router.get("/:id", async (req, res, next) => {
  try {
    const userP = User.findByPk(req.params.id);
    const pagesP = Page.findAll({
      where: {
        authorId: req.params.id,
      },
    });
    const [pages, user] = await Promise.all([pagesP, userP]);

    res.render("singleuserpages", {
      pages,
      user,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.render("userpage", { users });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
