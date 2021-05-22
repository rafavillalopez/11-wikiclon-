const router = require("express").Router();
const wikiRouter = require("./wiki");
const userRouter = require("./user");
const tagsRoutes = require("./tags");
const { Page } = require("../models");

router.use("/wiki", wikiRouter);
router.use("/users", userRouter);
router.use("/search", tagsRoutes);
router.use("/", async (req, res, next) => {
  try {
    const pages = await Page.findAll();
    res.render("index", { pages: pages });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
