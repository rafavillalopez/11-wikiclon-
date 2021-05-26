const { Page, User } = require("../models");
const router = require("express").Router();

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const userP = User.findByPk(id);

    const pagesP = Page.findAll({
      where: {
        authorId: id,
      },
    });

    const [pages, user] = await Promise.all([pagesP, userP]);

    if (user) {
      res.render("singleuserpages", {
        pages,
        user,
      });
    } else {
      throw new TypeError(400 + " Bad request. User not found");
    }
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
